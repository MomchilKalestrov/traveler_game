import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import locations from '@logic/mongoose/locations';
import communityMadeLocations from '@logic/mongoose/communityMadeLocations';
import userCheck from '@logic/usercheck';
import connect   from '@logic/mongoose/mongoose';
import { haversineDistance } from '@logic/utils';

const POST = async (request: NextRequest) => {
    const { name, lat, lng } = await request.json();
    if (!name|| !lat || !lng)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;

    const isCommunity = name.split('#')[0] === 'community';
    
    if (!(await userCheck(username, sessionId, isCommunity ? { xp: { $gte: 500 } } : undefined)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });


    try {
        // Connect to the database
        await connect();
        // Get the started locations
        const started: string[] = (await users.findOne({ username: username })).started;
        if (!started.includes(name))
            return NextResponse.json({ error: 'User isn\'t tracking this location.' }, { status: 412 });
        // Get the location
        let location: any;
        if (isCommunity)
            location = await communityMadeLocations.findOne({ name: name.split('#')[1], author: { $ne: username } });
        else
            location = await locations.findOne({ dbname: name });
        // Check if it exists
        if(!location)
            return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
        // Calculate the distance
        // If the user is within 100 meters of the location, claim the badge
        const distance = haversineDistance(
            lat, lng,
            parseFloat(location.location.lat.toString()),
            parseFloat(location.location.lng.toString())
        );
        if(distance > 100)
            return NextResponse.json({ error: 'User is not within 100 meters of the location.' }, { status: 400 });
        // Claim the rewards
        await users.updateOne(
            { username: cookie.get('username')?.value },
            {
                $pull: { started: name },
                $push: {
                    finished: {
                        location: name,
                        time: Date.now(),
                    } as any
                },
                $inc: { xp: isCommunity ? 10 : location.xp }
            }
        );
        // Add to the visited count
        if (isCommunity)
            await communityMadeLocations.updateOne(
                { name: name.split('#')[1] },
                { $inc: { visited: 1 } }
            );
        return NextResponse.json(null, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };