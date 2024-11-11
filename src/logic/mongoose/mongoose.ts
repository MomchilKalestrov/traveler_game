'use server';
import mongoose from 'mongoose';

let connection: mongoose.Mongoose | null = null;

const connect = async () => {
    if (!connection) 
        connection = await mongoose.connect(process.env.MONGODB_URI as string);
    
    return connection;
};

export default connect;