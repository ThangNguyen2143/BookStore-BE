const fs = require("fs");
const { uploads } = require("../until/cloudinary");
const {Product} = require('../models')

class ProductController{
    // [POST] /product/create
    async newProduct(req,res,next){
        // req.body.user = req.user._id;
        const product = await Product.create(req.body);
        res.status(201).json({
            product,
        });
    }
    // [GET]
    async getProducts(req, res, next) {
        // const resPerPage = 2;
        // const productsCount = await Product.countDocuments();

        // const apiFilters = new APIFilters(Product.find(), req.query)
        //     .search()
        //     .filter();

        // let products = await apiFilters.query;
        // const filteredProductsCount = products.length;

        // apiFilters.pagination(resPerPage);

        // products = await apiFilters.query.clone();

        // res.status(200).json({
        //     productsCount,
        //     resPerPage,
        //     filteredProductsCount,
        //     products,
        // });
    }
    // [GET] /product/:id
    async getProduct(req, res, next){
        const product = await Product.findOne({
            where:{name: req.params.id}
        });

        if (!product) {
            return next(new ErrorHandler("Product not found.", 404));
        }

        res.status(200).json({
            product,
        });
    };
    // [POST] config upload images
    async uploadProductImages (req, res, next) {
        let product = await Product.findByPk(req.query.id);

        if (!product) {
            return next(new ErrorHandler("Product not found.", 404));
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
            return next(new ErrorHandler("Product not found.", 404));
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
            return next(new ErrorHandler("Product not found.", 404));
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