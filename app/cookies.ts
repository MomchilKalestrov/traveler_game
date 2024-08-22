const getCookie = (key: string): { key: string, value: string } | undefined => {
    const decodedCookie: string = decodeURIComponent(document.cookie);
    const cookiePairs: Array<string> = decodedCookie.split(';');
    for(let i = 0; i <cookiePairs.length; i++) {
      let cookie = cookiePairs[i];
      while (cookie.charAt(0) == ' ')
        cookie = cookie.substring(1);
      
      const cookiePair: Array<string> = cookie.split('=');
        if (cookiePair[0] === key)
            return { key: cookiePair[0], value: cookiePair[1] };
    }
    return undefined;
}

const setCookie = (key: string, value: string): void => {
    // this will be probably outlive the rapture
    // prophesied by the Lord and Savior Jesus Christ
    const date: Date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value}; expires=${ date.toUTCString() };`;
}

const deleteCookie = (key: string): void => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

export { getCookie, setCookie, deleteCookie };