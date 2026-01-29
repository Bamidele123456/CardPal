import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { Product } from '../models/Product';

// CREATE
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.create({
      name,
      price,
      description,
      user: req.user!.id
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product',error });
  }
};

// GET ALL
export const getProducts = async (req: AuthRequest, res: Response) => {
  const products = await Product.find({ user: req.user!.id });
  res.status(200).json(products);
};

// GET ONE
export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(product);
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(product);
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json({ message: 'Product deleted' });
};

export const deleteBatchProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body; // Expecting { "ids": ["id1", "id2"] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of IDs' });
    }

    const result = await Product.deleteMany({
      _id: { $in: ids },
      user: req.user!.id 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No products found to delete' });
    }

    res.status(200).json({ message: `Successfully deleted ${result.deletedCount} products` });
  } catch (error) {
    res.status(500).json({ message: 'Error batch deleting products' });
  }
};