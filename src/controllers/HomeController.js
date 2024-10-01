const { Product, ProductType } = require('../models');

class HomeController {
  // [GET] home : Get 5 items best sales, 4 types of products
  async index(req, res, next) {
    var listType = await ProductType.findAll();
    var listproducts = await Product.findAll();
    res.status(200).json([listType, listproducts]);
  }
  // [POST] create/product-type : Create a new product type
  async newType(req, res, next) {
    var Type = req.body;
    console.log(Type.typeName);
    await ProductType.create({
      typeName: Type.typeName,
    });
    res.redirect('/');
  }
}

module.exports = new HomeController();
