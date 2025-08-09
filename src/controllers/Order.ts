import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const COLLECTION_NAME = 'orders';

// Create Order
export const addOrder = async (req: Request, res: Response) => {
  const { userId, products, total, status, address } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      userId,
      products, // array of product objects or IDs
      total,
      status,
      address,
      createdAt: new Date()
    });
    res.status(201).json({ message: 'Order created', orderId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Could not create order', details: err });
  }
};

// Read Order by ID
export const getOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const db = getDb();
    const order = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Could not get order', details: err });
  }
};

// Update Order
export const updateOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { products, total, status, address } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { products, total, status, address, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update order', details: err });
  }
};

// Delete Order
export const deleteOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(orderId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete order', details: err });
  }
};

// List all Orders
export const listOrders = async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const orders = await db.collection(COLLECTION_NAME).find().toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Could not list orders', details: err });
  }
};