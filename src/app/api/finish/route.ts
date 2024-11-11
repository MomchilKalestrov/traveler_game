import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import locations from '@logic/mongoose/locations';
import userCheck from '@logic/usercheck';
import connect   from '@logic/mongoose/mongoose';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
}

const POST = async (request: NextRequest) => {
    const { name, lat, lng } = await request.json();
    if (!name|| !lat || !lng)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;

    if(!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await connect();
        // Get the started locations
        const started: string[] = (await users.findOne({ username: username })).started;
        if (!started.includes(name))
            return NextResponse.json({ error: 'User isn\'t tracking this location.' }, { status: 412 });
        // Get the location
        const location = await locations.findOne({ name: name });
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

        // Claim the badge
        await users.updateOne(
            { username: cookie.get('username')?.value },
            {
                $set: { started: started.filter((started: string) => started !== name) },
                $push: {
                    finished: {
                        location: name,
                        time: Date.now(),
                    } as any
                },
                $inc: { xp: location.xp }
            }
        );
        // it should stay like this!!!!
        // someone remind me to fix this later :)

        // if I haven't fixed it by the end of the competition,
        // sorry, but I'm a lazy person.

        // I think it is fixed now
        return NextResponse.json(null, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };