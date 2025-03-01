import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { CommunityLandmark, Landmark, User } from '@logic/types';
import userCheck from '@logic/usercheck';

import connect from '@logic/mongoose/mongoose';
import users from '@logic/mongoose/user';
import landmark from '@logic/mongoose/landmark';
import communityMadeLandmark from '@logic/mongoose/communityMadeLandmark';

const POST = async (request: NextRequest) => {
    // Get the needed parameters
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
        const user = await users.findOne({ username: username }) as User;
        if (!user.markedForVisit.includes(name))
            return NextResponse.json({ error: 'User isn\'t tracking this landmark.' }, { status: 400 });
        // Remove the landmark from the user's list
        await users.updateOne(
            { username },
            { $pull: { markedForVisit: name } }
        );
        // Close the connection
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };