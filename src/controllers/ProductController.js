const fs = require("fs");
const { uploads } = require("../until/cloudinary");
const {Product} = require('../models');

class ProductController{
    // [POST] /product/create
    async newProduct(req,res,next){
        // req.body.user = req.user._id;
        const product = await Product.create(req.body);
        res.status(201).json(product);
    }

    // [GET] /api/products/get-products/
    async getProducts(req, res, next) {
        const {numberItem, typeGet} = req.query;
        const itemsHasPrice= await Product.findAll()
        if(!itemsHasPrice.length) return res.status(404).json({err: "Product not found"})
        switch (typeGet) {
            case 'best-seller': { // best-seller
                var temp =[]
                for (var i = 0; i < numberItem; i++){
                    const item = {
                        ...itemsHasPrice[i].dataValues,
                        saled: 50
                    }
                    temp.push(item)
                }
                res.json(temp)
                break;
            }
            case'recomment': {  // recomment product
                var temp =[]
                for (var i = 0; i < numberItem; i++){
                    const item = {
                        ...itemsHasPrice[i].dataValues,

                    }
                    temp.push(item)
                }
                res.json(temp)
                break;
            }
            default: {
                // Lấy tất cả sản phẩm
                res.json(itemsHasPrice)
            }
        }
        
       
        
        
    }
    // [GET] api/products/:id
    async getProduct(req, res, next){
        const product = await Product.findOne({
            where:{name: req.params.id}
        });

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        res.status(200).json({
            product,
        });
    };
    // [POST] config upload images
    async uploadProductImages (req, res, next) {
        let product = await Product.findByPk(req.query.id);

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        const uploader = async (path) => await uploads(path, "Products");

        let urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const imgUrl = await uploader(path);
            urls.push(imgUrl);
            fs.unlinkSync(path);
        }
        urls = JSON.stringify(urls);
        product = await Product.set({images: urls });

        res.status(200).json({
            data: urls,
            product,
        });
    };
    //[POST] /product/update/:id
    async updateProduct (req, res, next) {
        let product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        product = await Product.set({
            name: req.body.name,
            description: req.body.description,
            
        });

        res.status(200).json({
            product,
        });
    };
    // [POST] /product/delete/:id
    async deleteProduct (req, res, next) {
        let product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        var images = JSON.parse(product.images)
        for (let i = 0; i < images.length; i++) {
            await cloudinary.v2.uploader.destroy(
                images[i].public_id
            );
        }
        // This statement will set deletedAt
        await product.destroy({force: true});

        res.status(200).json({
            success: true,
        });
    };
    //[POST] review need add
    
}

module.exports = new ProductController