const {Order, OrderDetail} = require('../models');

class OrderController{

    // [GET] /cart/:userid
    async getOrder(req, res, next){
        // Lấy hoá đơn hiện đang hoạt động -> hoá đơn chưa xác nhận thanh toán
        var order = await Order.findAll({
            where:{CustomerId : req.params.userid,
                    state_order: 'active'}
        })
        var listItem = await OrderDetail.findAll({
            where:{orderId : order.id}
        })
        res.status(200).json([order, listItem])
    }
    // [POST] create/product-type : Create a new product type
    
}

module.exports = new OrderController