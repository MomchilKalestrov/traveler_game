import { NextResponse } from 'next/server';

import locations from '@logic/mongoose/locations';
import connect   from '@logic/mongoose/mongoose';

const GET = async () => {
    try {
        // Connect to the database
        await connect();
        // Get all locations
        const all = await locations.aggregate([
            { $project: { _id: 0, __v: 0 } }
        ]);
        // Close the connection
        return NextResponse.json(all, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };