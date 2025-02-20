import { NextResponse, NextRequest } from 'next/server';

const languages: string[] = ['en', 'bg'];
const defaultLocale: string = 'en';
 
export const middleware = (request: NextRequest) => {
    const url = request.nextUrl.pathname!
    
    const username = request.cookies.get('username')?.value;
    const sessionId = request.cookies.get('sessionId')?.value;
    const userLocale = request.cookies.get('locale')?.value || defaultLocale;

    let [ lang, page ] = url.split('/').splice(1);

    // if the current locale isn't the user's prefered locale, replace it
    // if the locale is not supported, redirect to the default locale
    if (lang != userLocale) lang = userLocale;
    if (!languages.includes(lang)) lang = defaultLocale;

    // if the page hasn't been specified, set it to 'home'
    // if the user doesn't have a session and/or username,
    // redirect him to the login page
    if (!page) page = 'home';
    if (!username || !sessionId) page = 'login';

    const newUrl = `/${ lang }/${ page }`;

    if (url != newUrl) return NextResponse.redirect(new URL(newUrl, request.url));
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^/]+/login|[^/]+/about).*)'
    ]
};
