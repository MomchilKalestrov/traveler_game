import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import mongoose    from 'mongoose';

import users     from '@logic/mongoose/user';
import locations from '@logic/mongoose/locations';

const GET = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const requestedUsername = args.get('username');

    const cookie = await cookies();
    const currentUsername = cookie.get('username')?.value;

    if(!requestedUsername)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    const username = requestedUsername === 'CURRENT_USER' ? currentUsername : requestedUsername;
    // This is when the body value was `CURRENT_USER` but the cookie was undefined
    if(!username)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Check if the user exists
        const user = await users.findOne({ username: username });
        if(!user) {
            await mongoose.connection.close();
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        };
        // Get the started locations
        const started = await locations.aggregate([
            { $project: { _id: 0, __v: 0 } },
            { $match:   { name: { $in: user.started } } }
        ]);
        // Close the connection
        await mongoose.connection.close();
        return NextResponse.json(started, { status: 200 });
    } catch(error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
};

export { GET };