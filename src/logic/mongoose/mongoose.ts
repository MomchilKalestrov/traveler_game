'use server';
import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached)
    cached = (global as any).mongoose = { conn: null, promise: null };

const connect = async () => {
    if (cached.conn) {
        return cached.conn;
    }
  
    if (!cached.promise) {  
        cached.promise = mongoose.connect(process.env.MONGODB_URI as string).then((mongoose) => {
            return mongoose;
        });
    }
  
    cached.conn = await cached.promise;
    return cached.conn;
};
  
export default connect;