'use server';
import { NextResponse, NextRequest } from 'next/server';

const languages = ['en', 'bg'];
 
export const middleware = (request: NextRequest) => {
    const url = request.nextUrl.pathname!
    
    const username = request.cookies.get('username');
    const password = request.cookies.get('password');

    const slug = url.split('/')[1];
    
    if (
	username && password ||
	!languages.includes(slug)
        url.includes('login')
    )
        return NextResponse.next();
    
    return NextResponse.redirect(new URL(`/${ slug }/login`, request.url));
}

export const config = { matcher: [ '/:lang*' ] };
