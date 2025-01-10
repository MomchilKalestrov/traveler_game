import { NextResponse, NextRequest } from 'next/server';

const languages: string[] = ['en', 'bg'];
 
export const middleware = (request: NextRequest) => {
    const url = request.nextUrl.pathname!
    
    const username = request.cookies.get('username')?.value;
    const password = request.cookies.get('password')?.value;
    const userlocale = request.cookies.get('locale')?.value || 'en';

    const [ lang, page ] = url.split('/').splice(1);
    
    // automatically swap to user's prefered locale
    if (
        userlocale !== lang && page &&
        languages.includes(lang) &&
        languages.includes(userlocale)
    )
        return NextResponse.redirect(new URL(`/${ userlocale }/${ page }`, request.url));
    
    // do not redirect to the login if the page is the login or aboutus
    if (
	    (username && password) ||
	    !languages.includes(lang) ||
        url.includes('login') ||
        url.includes('about')
    )
        return NextResponse.next();
    
    // if the user wasn't logged in, redirect him automatically
    return NextResponse.redirect(new URL(`/${ lang }/login`, request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^/]+/login|[^/]+/about).*)'
    ]
};
