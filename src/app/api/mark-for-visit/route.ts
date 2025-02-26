import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { CommunityLandmark, Landmark, User } from '@logic/types';
import userCheck from '@logic/usercheck';

import connect from '@logic/mongoose/mongoose';
import users from '@logic/mongoose/user';
import landmark from '@logic/mongoose/landmark';
import communityMadeLandmark from '@logic/mongoose/communityMadeLandmark';

const POST = async (request: NextRequest) => {
    // Get the name of the location
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Missing parameters.' });
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;
    
    const isCommunity = name.split('#')[0] === 'community';

    if(!(await userCheck(username, sessionId, isCommunity ? { xp: { $gte: 500 } } : undefined)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await connect();
        // Get the user
        const user = await users.findOne({ username }) as User;
        if (user.markedForVisit.includes(name)) 
            return NextResponse.json({ error: 'User has already marked the landmark for visit.' }, { status: 400 });
        // Get the landmark
        let landmarkExists: CommunityLandmark | Landmark =
            isCommunity
            ?   await communityMadeLandmark.findOne({ name: name.split('#')[1], author: { $ne: username } }) as CommunityLandmark
            :   await landmark.findOne({ dbname: name }) as Landmark;
        // Check if it exists
        if(!landmarkExists)
            return NextResponse.json({ error: 'Landmark not found.' }, { status: 404 });
        // Mark the landmark for visit
        await users.updateOne(
            { username },
            { $push: { markedForVisit: name } }
        );
        // Close the connection
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };