"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBatchProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = require("../models/Product");
// CREATE
const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = await Product_1.Product.create({
            name,
            price,
            description,
            user: req.user.id
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};
exports.createProduct = createProduct;
// GET ALL
const getProducts = async (req, res) => {
    const products = await Product_1.Product.find({ user: req.user.id });
    res.status(200).json(products);
};
exports.getProducts = getProducts;
// GET ONE
const getProductById = async (req, res) => {
    const product = await Product_1.Product.findById(req.params.id);
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
};
exports.getProductById = getProductById;
// UPDATE
const updateProduct = async (req, res) => {
    const product = await Product_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
};
exports.updateProduct = updateProduct;
// DELETE
const deleteProduct = async (req, res) => {
    const product = await Product_1.Product.findByIdAndDelete(req.params.id);
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
};
exports.deleteProduct = deleteProduct;
const deleteBatchProducts = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting { "ids": ["id1", "id2"] }
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of IDs' });
        }
        const result = await Product_1.Product.deleteMany({
            _id: { $in: ids },
            user: req.user.id
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No products found to delete' });
        }
        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} products` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error batch deleting products' });
    }
};
exports.deleteBatchProducts = deleteBatchProducts;
