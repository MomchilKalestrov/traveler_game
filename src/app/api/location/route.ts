import { NextRequest, NextResponse } from 'next/server';

import locations from '@logic/mongoose/locations';
import connect   from '@logic/mongoose/mongoose';

const GET = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const name = args.get('name');

    if (!name)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        // Connect to the database
        await connect();
        // Get the location
        const location = await locations.findOne({ name: name }, { _id: 0, __v: 0 });
        if (!location) {
            return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
        }
        // Close the connection
        return NextResponse.json(location, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };