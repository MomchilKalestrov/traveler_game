import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import locations from '@logic/mongoose/locations';
import connect   from '@logic/mongoose/mongoose';
import userCheck from '@logic/usercheck';
import localeSelector from '@src/logic/mongoose/DBLanguageSelector';

const GET = async () => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;
    const locale   = cookie.get('locale')?.value || 'en';

    if(!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await connect();
        // Check if the user exists
        const user = await users.findOne({ username: username });
        // Get the finished locations
        const finished = await locations.aggregate([
            { $match: { dbname: { $in: user.finished.map((l: any) => l.location) } } },
            ...localeSelector(locale)
        ]);
        // Close the connection
        return NextResponse.json(finished, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };