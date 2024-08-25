import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from "next/server"

const POST = async (request: NextRequest) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const body = await request.json();
    if(!body) return NextResponse.json({ error: 'Invalid request.' });

    try {

        await client.close();
        return NextResponse.json({ success: true });
    }
    catch (error) {
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' });
    }
}