import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

function getMongoDBUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined in .env.local"
    );
  }

  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache || {
    conn: null,
    promise: null,
  };

global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(
      getMongoDBUri(),
      {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      }
    );
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
