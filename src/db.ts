import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.xahojii.mongodb.net/test'; let client: MongoClient; let db: Db;

export const getDb = (): Db => { if (!db) { throw new Error('Database not initialized. Call connectDb first.'); } return db; };

export const connectDb = async () => { if (!client) { client = new MongoClient(uri); await client.connect(); db = client.db(); } };

connectDb().catch(err => { console.error('Failed to connect to the database', err); });

export default { connectDb, getDb };