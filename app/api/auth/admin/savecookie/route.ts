import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { md5 } from 'js-md5';

const POST = async (request: any) => {
    const cookie = cookies();
    const args = await request.json();

    if (!args.passphrase) return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    
    cookie.set('passphrase', md5(args.passphrase));
    return new NextResponse(null, { status: 204 });
}

export { POST };