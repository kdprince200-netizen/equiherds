import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("MongoDB connection string missing");
}

// Global cache (required for Next.js)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connectDB() {
  // If we have an active connection AND it is healthy, reuse it
  if (
    cached.conn &&
    mongoose.connection.readyState === 1
  ) {
    return cached.conn;
  }

  // Reset stale connection
  if (mongoose.connection.readyState !== 0 && mongoose.connection.readyState !== 1) {
    try {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
    } catch (_) {
      // Ignore disconnect errors
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 10000,   // Increase timeout for connection
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
      })
      .then((mongooseInstance) => {
        // Verify connection is actually ready after connect
        if (mongooseInstance.connection.readyState === 1) {
          return mongooseInstance;
        }
        // If connection exists but not ready, wait for it
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds max wait
          
          const checkConnection = () => {
            attempts++;
            if (mongooseInstance.connection.readyState === 1) {
              resolve(mongooseInstance);
            } else if (mongooseInstance.connection.readyState === 0 || attempts >= maxAttempts) {
              cached.promise = null;
              cached.conn = null;
              reject(new Error('MongoDB connection failed to become ready'));
            } else {
              // Still connecting, wait a bit more
              setTimeout(checkConnection, 100);
            }
          };
          
          // Start checking immediately
          checkConnection();
        });
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  
  // Final verification that connection is ready
  if (mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
    throw new Error('MongoDB connection not ready after connect');
  }
  
  return cached.conn;
}

/* Optional but strongly recommended logging */
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.error("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});
