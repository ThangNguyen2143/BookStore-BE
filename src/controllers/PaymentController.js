/**
 * Created by CTT VNPAY
*/
// let $ = require("jquery");
const request = require("request");
const moment = require("moment");
const sortObject = require("../until/sortObject");
const querystring = require("qs");
const crypto = require("crypto");
require('dotenv').config();

class PaymentController{
    // [POST] /create_payment_url
    create_payment_url(req, res) {
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");
        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = process.env.VNP_TMNCODE;
        let secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        let returnUrl = process.env.VNP_RETURNURL;
        let orderId = moment(date).format("DDHHmmss");
        let {amount, language} = req.body;
        // let bankCode = req.body.bankCode;

        if (language === null || language === "") {
            language = "vn";
        }
        let currCode = "VND";
        let vnp_Params = {
            "vnp_Version": "2.1.0",
            "vnp_Command": "pay",
            "vnp_TmnCode": tmnCode,
            "vnp_Locale": language,
            "vnp_CurrCode": currCode,
            "vnp_TxnRef": orderId,
            "vnp_OrderInfo": "Thanh toan cho ma GD:" + orderId,
            "vnp_OrderType": "other",
            "vnp_Amount": amount * 100,
            "vnp_ReturnUrl": returnUrl,
            "vnp_IpAddr": ipAddr,
            "vnp_CreateDate": createDate,
        };
        // if (bankCode !== null && bankCode !== "") {
        //   vnp_Params["vnp_BankCode"] = bankCode;
        // }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        // let hmac = bcrypt.hash(secretKey)
        let newBuffer = Buffer(signData, "utf-8")
        let signed = hmac.update(newBuffer).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        res.json({ vnpUrl });
    }
    // [GET] /vnpay_response
    paymentResponse(req, res, next){
        let vnp_Params = req.query;

        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = process.env.VNP_HASHSECRET;

        let signData = querystring.stringify(vnp_Params, { encode: false });
        
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            // Assume orderId is available in the request query
            let orderId = req.query.orderId;
            if (orderId) {
            // Redirect to the invoice page with orderId
                res.redirect(`${process.env.CLIENT_ROOT}/checkout/success`);
            } else {
            // Handle case where orderId is not available
                res.send({ status: "error", message: "Order ID is missing" });
            }
        } else {
            res.send({ status: "error", code: "97" });
        }
    }
    // [GET] /vnpay_ipn
    fastPayment(req, res, next){
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];

        let orderId = vnp_Params["vnp_TxnRef"];
        let rspCode = vnp_Params["vnp_ResponseCode"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = process.env.VNP_HASHSECRET;

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
        //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
        //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

        let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
        let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
        if (secureHash === signed) {
            //kiểm tra checksum
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus == "0") {
                        //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                        if (rspCode == "00") {
                            //thanh cong
                            //paymentStatus = '1'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                            res.status(200).json({ RspCode: "00", Message: "Success" });
                        } else {
                            //that bai
                            //paymentStatus = '2'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                            res.status(200).json({ RspCode: "00", Message: "Success" });
                        }
                    } else {
                        res.status(200).json({
                            RspCode: "02",
                            Message: "This order has been updated to the payment status",
                        });
                    }
                } else {
                    res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
                }
            } else {
                res.status(200).json({ RspCode: "01", Message: "Order not found" });
            }
        } else {
            res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
        }
    }
    // [POST] /querydr 
    querydr(req, res){
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let date = new Date();

        let crypto = require("crypto");

        let vnp_TmnCode = process.env.VNP_TMNCODE;
        let secretKey = process.env.VNP_HASHSECRET;
        let vnp_Api = process.env.VNP_API;

        let vnp_TxnRef = req.body.orderId;
        let vnp_TransactionDate = req.body.transDate;

        let vnp_RequestId = moment(date).format("HHmmss");
        let vnp_Version = "2.1.0";
        let vnp_Command = "querydr";
        let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

        let vnp_IpAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let currCode = "VND";
        let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

        let data =
            vnp_RequestId +
            "|" +
            vnp_Version +
            "|" +
            vnp_Command +
            "|" +
            vnp_TmnCode +
            "|" +
            vnp_TxnRef +
            "|" +
            vnp_TransactionDate +
            "|" +
            vnp_CreateDate +
            "|" +
            vnp_IpAddr +
            "|" +
            vnp_OrderInfo;

        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

        let dataObj = {
            vnp_RequestId: vnp_RequestId,
            vnp_Version: vnp_Version,
            vnp_Command: vnp_Command,
            vnp_TmnCode: vnp_TmnCode,
            vnp_TxnRef: vnp_TxnRef,
            vnp_OrderInfo: vnp_OrderInfo,
            vnp_TransactionDate: vnp_TransactionDate,
            vnp_CreateDate: vnp_CreateDate,
            vnp_IpAddr: vnp_IpAddr,
            vnp_SecureHash: vnp_SecureHash,
        };
        // /merchant_webapi/api/transaction
        request(
            {
            url: vnp_Api,
            method: "POST",
            json: true,
            body: dataObj,
            },
            function (error, response, body) {
            console.log(response);
            }
        );
    }
    // [POST] /refund
    refund(req, res, next){
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let date = new Date();

        let crypto = require("crypto");

        let vnp_TmnCode = process.env.VNP_TMNCODE;
        let secretKey = process.env.VNP_HASHSECRET;
        let vnp_Api = process.env.VNP_API;

        let vnp_TxnRef = req.body.orderId;
        let vnp_TransactionDate = req.body.transDate;
        let vnp_Amount = req.body.amount * 100;
        let vnp_TransactionType = req.body.transType;
        let vnp_CreateBy = req.body.user;

        let currCode = "VND";

        let vnp_RequestId = moment(date).format("HHmmss");
        let vnp_Version = "2.1.0";
        let vnp_Command = "refund";
        let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

        let vnp_IpAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

        let vnp_TransactionNo = "0";

        let data =
            vnp_RequestId +
            "|" +
            vnp_Version +
            "|" +
            vnp_Command +
            "|" +
            vnp_TmnCode +
            "|" +
            vnp_TransactionType +
            "|" +
            vnp_TxnRef +
            "|" +
            vnp_Amount +
            "|" +
            vnp_TransactionNo +
            "|" +
            vnp_TransactionDate +
            "|" +
            vnp_CreateBy +
            "|" +
            vnp_CreateDate +
            "|" +
            vnp_IpAddr +
            "|" +
            vnp_OrderInfo;
        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

        let dataObj = {
            vnp_RequestId: vnp_RequestId,
            vnp_Version: vnp_Version,
            vnp_Command: vnp_Command,
            vnp_TmnCode: vnp_TmnCode,
            vnp_TransactionType: vnp_TransactionType,
            vnp_TxnRef: vnp_TxnRef,
            vnp_Amount: vnp_Amount,
            vnp_TransactionNo: vnp_TransactionNo,
            vnp_CreateBy: vnp_CreateBy,
            vnp_OrderInfo: vnp_OrderInfo,
            vnp_TransactionDate: vnp_TransactionDate,
            vnp_CreateDate: vnp_CreateDate,
            vnp_IpAddr: vnp_IpAddr,
            vnp_SecureHash: vnp_SecureHash,
        };

        request(
            {
            url: vnp_Api,
            method: "POST",
            json: true,
            body: dataObj,
            },
            function (error, response, body) {
            console.log(response);
            }
        );
    }
}

module.exports = new PaymentController

