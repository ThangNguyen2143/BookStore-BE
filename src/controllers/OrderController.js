const {Order, OrderDetail, Customer, Product, Staff} = require('../models');

class OrderController{

    // [GET] /api/cart
    async getOrder(req, res, next){
        let customer = await Customer.findOne({where:{UserId: req.user.id}})
        // Lấy hoá đơn hiện đang hoạt động -> hoá đơn chưa xác nhận thanh toán
        const order = await Order.findOne({
            where:{CustomerId : customer.id,
                    state_order: 'active'}
        })
        const listItem = await OrderDetail.findAll({
            where:{orderId : order.id}
        })
        res.status(200).json([order, listItem])
    }
    // [POST] /api/cart/add-cart
    async addtoCart(req, res, next) {
        let customer = await Customer.findOne({where:{UserId: req.user.id}})
        let product = await Product.findOne({where:{id: req.body.productId}})
        let mount = req.body.mount;
        if(!product || product.stores <= 0) return res.status(404).json({message:"Sản phẩm không tồn tại hoặc hết hàng"})
        const priceProduct = product['price']
        // Là thêm sản phẩm vào hoá đơn đang hoạt động
        // Tìm hoá đơn đang hoạt động
        let cart = await Order.findOne({where: {CustomerId: customer.id, state_order: 'active'}})
        // Kiểm tra nếu chưa có hoá đơn => tạo hoá đơn mới, thêm sản phẩm
        if (!cart){
            cart = await Order.create({
                address_receive: customer.address,
                state_order: 'active',
                summary:(mount * product.price),
                CustomerId: customer.id,
                StaffId: 1,
            },{
                include: [ Customer, Staff]
            })
            let newDetails = await OrderDetail.create({
                OrderId: cart.id,
                ProductId: product.id,
                quantity: mount, 
                total: (mount*priceProduct)
            })
            await product.addOrder(cart.id, {through: {newDetails}})
            return res.status(200).json({cart})
        }else{ //Đã có đơn hàng chưa thanh toán, tìm sản phẩm trùng hoặc thêm mới
            let detailOrderItem= await OrderDetail.findOne({
                where: {OrderId: cart.id, ProductId: product.id},
            })

            if(detailOrderItem){
                detailOrderItem.quantity = detailOrderItem.quantity + mount;
                detailOrderItem.total = detailOrderItem.total + mount*product.price;
            }else {
                 detailOrderItem = await OrderDetail.create({
                    OrderId: cart.id,
                    ProductId: product.id,
                    quantity: mount, 
                    total: (mount*priceProduct)
                })
            }
            console.log(detailOrderItem)
            
            await Order.update(
                { summary: (cart.summary+ detailOrderItem.total) },
                {
                    where: {
                        id: cart.id,
                    },
                },
            );
            return res.status(200).json({mess: "Success to add product", detailOrderItem})
            
        }
    }
    // [GET] /api/orders
    async getOrders(req, res, next) {
        let order = await Order.findAll({where: {state_order: 'pending' || 'success'}})
        res.json(order)
    }
}

module.exports = new OrderController