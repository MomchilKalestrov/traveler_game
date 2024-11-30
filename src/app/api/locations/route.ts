import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import users   from '@src/logic/mongoose/user';
import connect from '@logic/mongoose/mongoose';
import userCheck from '@logic/usercheck';
import locations from '@logic/mongoose/locations';
import localeSelector from '@logic/mongoose/DBLanguageSelector';

const MAX_PAGES = Number(process.env.NEXT_PUBLIC_MAX_LOCATIONS || 6);

const GET = async (request: NextRequest) => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;

    if(!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    
    const args: URLSearchParams = new URL(request.url).searchParams;
    const locale = args.get('locale') || 'en';

    try {
        // Connect to the database
        await connect();
        // Get all locations
        const user = await users.findOne({ username: username });
        const level = Math.floor(user.xp / 100);
        const all = await locations.aggregate([
            { $match: { minlevel: { $lte: level } } },
            ...localeSelector(locale),
            { $limit: MAX_PAGES }
        ]);
        // Close the connection
        return NextResponse.json(all, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };