import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import locations from '@logic/mongoose/locations';

const GET = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const name = args.get('name');

    if (!name)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Get the location
        const location = await locations.findOne({ name: name }, { _id: 0, __v: 0 });
        if (!location) {
            await mongoose.connection.close();
            return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
        }
        // Close the connection
        await mongoose.connection.close();
        return NextResponse.json(location, { status: 200 });
    } catch(error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };