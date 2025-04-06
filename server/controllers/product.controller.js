const Product = require("../models/product.model.js");

const createProduct = async (req, res) => {
    try {
        const categories = req.body.categories ? req.body.categories.split(",") : [];
        const newProduct = new Product({
            ...req.body,
            categories: categories,
            image: req.file.path, // Changed from 'images' to 'image' to match the schema
        });
        await newProduct.save();
        res.status(200).json({
            message: "Product created successfully",
            newProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating product",
            error: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );
        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating product",
            error: error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting product",
            error: error.message,
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            message: "Product fetched successfully",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching product",
            error: error.message,
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const qLatest = req.query.latest;
        const qCategory = req.query.category;

        let product;

        if (qLatest) {
            product = await Product.find().sort({ createdAt: -1 }).limit(3);
        } else if (qCategory) {
            product = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            product = await Product.find();
        }
        res.status(200).json({
            message: "Products fetched successfully",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching products",
            error: error.message,
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
};