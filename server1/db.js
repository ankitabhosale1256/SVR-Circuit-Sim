import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ankitasvrrobotics:ddFOWqcymVv73f90@tender.wthpxho.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "circuitsimDB";
let db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB:", dbName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}
