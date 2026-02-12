import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Persist across container reuses
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 1. If connection is already open (readyState 1), use it.
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If the connection state is 'connecting' (2) or 'disconnecting' (3), 
  // or if it's 'disconnected' (0) but a promise exists, reset everything.
  // This cleans up "zombie" connections from local reloads.
  if (mongoose.connection.readyState !== 1) {
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 🔥 FAIL FAST: Don't wait 10s if connection drops
      maxPoolSize: 3,        // Safe middle-ground for all functions
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    };

    console.log("🚀 MongoDB: Opening fresh connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear on error
    console.error("❌ MongoDB Connection Error:", e);
    throw e;
  }

  return cached.conn;
};