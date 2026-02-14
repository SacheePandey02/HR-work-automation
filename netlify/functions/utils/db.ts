
import mongoose from "mongoose";

console.log("🔎 DEBUG: process.env.MONGODB_URI =", process.env.MONGODB_URI);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in environment variables");
  throw new Error("MONGODB_URI is not defined");
}

// Persist across container reuses
let cached = (global as any).mongoose;

if (!cached) {
  console.log("🆕 DEBUG: Creating new global mongoose cache");
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  console.log("📡 DEBUG: connectDB called");
  console.log("📊 DEBUG: Current readyState =", mongoose.connection.readyState);

  // 1. If already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("✅ DEBUG: Using existing MongoDB connection");
    return cached.conn;
  }

  // 2. Reset zombie connections
  if (mongoose.connection.readyState !== 1) {
    console.log("♻️ DEBUG: Resetting cached.promise");
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 3,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    };

    console.log("🚀 DEBUG: Opening fresh MongoDB connection...");
    console.log("🔗 DEBUG: Connecting to ->", MONGODB_URI);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("🎉 DEBUG: MongoDB connected successfully!");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error FULL:", e);
    throw e;
  }

  return cached.conn;
};
