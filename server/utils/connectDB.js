import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) throw new Error('Please define the MONGO_URI environment variable inside .env');

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Connected to DB (Cached)');
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
