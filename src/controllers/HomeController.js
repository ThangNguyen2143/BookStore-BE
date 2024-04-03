const {Products, ProductTypes} = require('../models');

class HomeController{

    // [GET] home : Get 5 items best sales, 4 types of products
    async index(req, res, next){
        var listType = await ProductTypes.findAll()
        var listproducts = await Products.findAll()
        res.status(200).json([listType, listproducts])
    }
    // [POST] create/product-type : Create a new product type
    async newType (req, res, next){
        var Type = req.body;
        console.log(Type.typeName)
        await ProductTypes.create({
            typeName: Type.typeName
        })
        res.redirect('/')
    }   
}

module.exports = new HomeController