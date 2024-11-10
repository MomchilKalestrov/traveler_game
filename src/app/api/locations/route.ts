import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import locations from '@logic/mongoose/locations';

const GET = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Get all locations
        const all = await locations.aggregate([
            { $project: { _id: 0 } }
        ]);
        // Close the connection
        await mongoose.connection.close();
        return NextResponse.json(all, { status: 200 });
    } catch(error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };