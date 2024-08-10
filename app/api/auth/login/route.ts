import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { md5 } from 'js-md5';

const POST = async (request: Request) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    
    if(!args.get('password') || !args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' });

    const user = cookies();
    user.set('username', args.get('username') || '');
    user.set('password', md5(args.get('password') || ''));

    return NextResponse.redirect('/main/Home');
};

export { POST };