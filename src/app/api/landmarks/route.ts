import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import connect   from '@logic/mongoose/mongoose';
import userCheck from '@logic/usercheck';
import landmark from '@src/logic/mongoose/landmark';
import localeSelector from '@logic/mongoose/DBLanguageSelector';

const GET = async () => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;
    const locale   = cookie.get('locale')?.value || 'en';

    if(!(await userCheck(username, sessionId)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await connect();
        // Get all landmarks
        const all = await landmark.aggregate([ ...localeSelector(locale) ]);
        // Close the connection
        return NextResponse.json(all, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };