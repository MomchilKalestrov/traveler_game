'use server';
import mongoose from 'mongoose';

let connection: mongoose.Mongoose | null = null;

const connect = async () => {
    if (!connection) {
        console.log('Creating a new connection to the DB server.');
        connection = await mongoose.connect(process.env.MONGODB_URI as string);
    };
    
    return connection;
};

export default connect;