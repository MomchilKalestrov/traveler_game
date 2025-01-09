import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import users   from '@logic/mongoose/user';
import connect from '@logic/mongoose/mongoose';

const GET = async (request: NextRequest) => {
    const params = new URL(request.url).searchParams;
    const id = params.get('id');
    const cookie = cookies();

    if (!id)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        await connect();

        const user = await users.findOne({ _id: id });
        if (!user)
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        await users.updateOne({ _id: id }, { verified: true });

        (await cookie).set('username', user.username);
        (await cookie).set('password', user.password);

        return NextResponse.redirect(new URL('/home', 'https://venturo-game.vercel.app'));
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };