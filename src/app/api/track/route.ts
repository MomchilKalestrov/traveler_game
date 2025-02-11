import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import locations from '@logic/mongoose/locations';
import communityMadeLocations from '@logic/mongoose/communityMadeLocations';
import userCheck from '@logic/usercheck';
import connect   from '@logic/mongoose/mongoose';

const POST = async (request: NextRequest) => {
    // Get the name of the location
    const { name } = await request.json();
    if (!name)
        return NextResponse.json({ error: 'Missing parameters.' });
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;
    
    const isCommunity = name.split('#')[0] === 'community';

    if(!(await userCheck(username, password, isCommunity ? { xp: { $gte: 500 } } : undefined)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await connect();
        // Get the user
        const user = await users.findOne({ username });
        if (user.started.includes(name)) 
            return NextResponse.json({ error: 'User is already tracking this location.' }, { status: 400 });
        // Get the location
        let location: any;
        if (isCommunity)
            location = await communityMadeLocations.findOne({ name: name.split('#')[1], author: { $ne: username } });
        else
            location = await locations.findOne({ dbname: name });
        // Check if it exists
        if(!location)
            return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
        // Start tracking the location
        await users.updateOne(
            { username },
            { $push: { started: name } }
        );
        // Close the connection
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };