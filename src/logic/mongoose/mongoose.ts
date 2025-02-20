'use server';
import mongoose from 'mongoose';

let connection: Promise<mongoose.Mongoose> | null = null;

const connect = async (): Promise<mongoose.Mongoose> => {
    if (!connection) {
        console.log('Creating a new connection to the DB server.');
        connection = mongoose.connect(process.env.MONGODB_URI as string);
        connection.catch((error) => {
            console.log('An error has occured while connecting to the DB:\n', error);
            connection = null;
        });
    };
    
    return await connection;
};

export default connect;