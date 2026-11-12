import mongoose from 'mongoose';
import dns from 'dns';

// Prefer reliable DNS servers to avoid local router SRV query timeouts / hijacking on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fall back to system DNS if not permitted
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB using Mongoose with reusable connection caching,
 * fast connection timeout handling, and descriptive error reporting.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not defined in environment variables. Please check your .env.local file.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
      dbName: process.env.MONGODB_DB_NAME || 'student_management',
    };

    const connectionPromise = mongoose.connect(MONGODB_URI, opts);

    // Timeout guard so API requests fail fast with a friendly error if database is unreachable
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            'MongoDB connection timed out. Please verify your MONGODB_URI and ensure your cluster is accessible.'
          )
        );
      }, 7000);
    });

    cached.promise = Promise.race([connectionPromise, timeoutPromise])
      .then((m) => {
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectDB;
