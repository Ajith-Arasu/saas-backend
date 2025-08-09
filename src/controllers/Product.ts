import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const COLLECTION_NAME = 'products';

// Create Product
export const addProduct = async (req: Request, res: Response) => {
  const { category, name, description, price, stock, images } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne({ category, name, description, price, stock, images });
    res.status(201).json({ message: 'Product added', productId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Could not add product', details: err });
  }
};

// Read Product by ID
export const getProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const db = getDb();
    const product = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Could not get product', details: err });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const {category, name, description, price, stock, images } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(productId) },
      { $set: { category, name, description, price, stock, images } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update product', details: err });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete product', details: err });
  }
};

// List all Products
export const listProducts = async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const products = await db.collection(COLLECTION_NAME).find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Could not list products', details: err });
  }
}