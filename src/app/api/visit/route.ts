import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import landmark  from '@logic/mongoose/landmark';
import communityMadeLandmark from '@logic/mongoose/communityMadeLandmark';
import userCheck from '@logic/usercheck';
import connect   from '@logic/mongoose/mongoose';
import { haversineDistance } from '@logic/utils';
import { User, Landmark, CommunityLandmark } from '@logic/types';

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
        // Get the user data
        const user: User = (await users.findOne({ username: username })) as User;
        if (!user.markedForVisit.includes(name))
            return NextResponse.json({ error: 'User hasn\'t marked this landmark for visit.' }, { status: 412 });
        // Get the landmark data
        let l: CommunityLandmark | Landmark =
            isCommunity
            ?   await communityMadeLandmark.findOne({ name: name.split('#')[1], author: { $ne: username } }) as CommunityLandmark
            :   await landmark.findOne({ dbname: name }) as Landmark;
        // Check if it exists
        if (!l) return NextResponse.json({ error: 'Landmark not found.' }, { status: 404 });
        // Make sure the needed data is present
        let universalLandmark = {
            xp: 10,
            dbname: `community#${ name }`,
            ...(l as any)._doc
        };
        // Calculate the distance
        // If the user is within 100 meters of the location, claim the badge
        const distance = haversineDistance(
            lat, lng,
            parseFloat(universalLandmark.location.lat.toString()),
            parseFloat(universalLandmark.location.lng.toString())
        );
        if(distance > 100)
            return NextResponse.json({ error: 'User is not within 100 meters of the landmark\'s landmark.' }, { status: 400 });
        // Claim the rewards
        await users.updateOne(
            { username: cookie.get('username')?.value },
            {
                $pull: { markedForVisit: name },
                $push: {
                    visited: {
                        dbname: name,
                        time: Date.now(),
                    } as any
                },
                $inc: { xp: isCommunity ? 10 : universalLandmark.xp }
            }
        );
        // Add to the visited count
        if (isCommunity)
            await communityMadeLandmark.updateOne(
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