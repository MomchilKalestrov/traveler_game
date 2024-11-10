import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import users from '@logic/mongoose/user'

const GET = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Get the top 100 users by XP
        const top100 = await users.aggregate([
            { $project: { _id: 0, password: 0 } },
            { $sort: { xp: -1 } },
            { $limit: 100 }
        ]);
        // Close the connection
        await mongoose.connection.close();
        return NextResponse.json(top100, { status: 200 });
    } catch(error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
}

export { GET };