import { NextResponse } from 'next/server';
import userCheck from '../../usercheck';
import { cookies } from 'next/headers';
import fs from 'fs';

const POST = async (request: Request) => {
    const cookie = cookies();
    const body = await request.json();

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' });

    if (!body.image)
        return NextResponse.json({ error: 'Missing parameters.' });

    if (!fs.existsSync(`${ process.cwd() }/user`))
        fs.mkdirSync(`${ process.cwd() }/user`, { recursive: true });

    const buffer = Buffer.from(body.image.split(',')[1], 'base64');

    fs.writeFileSync(`${ process.cwd() }/user/${cookie.get('username')?.value}.png`, buffer);

    return NextResponse.json({ ok: true });
}

export { POST };