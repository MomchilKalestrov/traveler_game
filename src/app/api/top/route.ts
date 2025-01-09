import { NextResponse } from 'next/server';

import users   from '@logic/mongoose/user';
import connect from '@logic/mongoose/mongoose';

const GET = async () => {
    try {
        // Connect to the database
        await connect();
        // Get the top 100 users by XP
        const top100 = await users.aggregate([
            { $match: { verified: true } },
            { $project: { password: 0, _id: 0, __v: 0, email: 0, verified: 0 } },
            { $sort: { xp: -1 } },
            { $limit: 20 }
        ]);
        // Close the connection
        return NextResponse.json(top100, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
}

export { GET };