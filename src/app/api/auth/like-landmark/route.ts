import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import userCheck from '@logic/usercheck';
import connect from '@logic/mongoose/mongoose';
import communityMadeLandmark from '@logic/mongoose/communityMadeLandmark';

const POST = async (request: NextRequest) => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;
    const { name } = await request.json();
    
    if (!(await userCheck(username, sessionId)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    if (!name) return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        await connect();
        
        const landmark = await communityMadeLandmark.findOne({ name, likes: { $nin: username } });
        if (!landmark) return NextResponse.json({ error: 'Landmark not found.' }, { status: 404 });
        await communityMadeLandmark.findOneAndUpdate({ name }, { $push: { likes: username } })

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };