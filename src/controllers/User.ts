import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db'; // You need to implement this helper to get your MongoDB connection
import jwt from 'jsonwebtoken';

const COLLECTION_NAME = 'users';

// Add User
export const addUser = async (req: Request, res: Response) => {
  console.log('Received request to add user:', req);
  const { name, email, passwordhash } = req.body;
  try {
    console.log('Adding user:', { name, email, passwordhash });
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne({ name, email, passwordhash });
    res.status(201).json({ message: 'User added', userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add user', details: err });
  }
};


// Middleware to authenticate JWT token
export const authenticate = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, "abcd", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    // Optionally attach user info to request
    (req as any).user = decoded;
    next();
  });
};

export const signIn = async (req: Request, res: Response) => {
  const { email, passwordhash } = req.body;
  try {
    const db = getDb();
    const user = await db.collection(COLLECTION_NAME).findOne({ email, passwordhash });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "abcd", { expiresIn: '1h' });
    res.json({ message: 'Sign in successful', userId: user._id, token });
  } catch (err) {
    res.status(500).json({ error: 'Could not sign in', details: err });
  }
};

// Get User by ID
export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const db = getDb();
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Could not get user', details: err });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name, email } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update user', details: err });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete user', details: err });
  }
};

// List all Users
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const users = await db.collection(COLLECTION_NAME).find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Could not list users', details: err });
  }
};