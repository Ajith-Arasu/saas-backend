import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';
import jwt from 'jsonwebtoken';

const COLLECTION_NAME = 'products';

// JWT authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  jwt.verify(token, "abcd", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = decoded;
    next();
  });
};

// Create Product
export const addProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne({ name, description, price, stock });
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
  const { name, description, price, stock } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(productId) },
      { $set: { name, description, price, stock } }
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