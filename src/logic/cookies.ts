type cookie = {
    key: string;
    value: string;
};

const getCookie = (key: string): cookie | undefined => {
  const decodedCookie: string = decodeURIComponent(document.cookie);
  const cookiePairs: Array<string> = decodedCookie.split(';');

  cookiePairs.forEach((pair: string) => {
    while (pair.charAt(0) == ' ')
      pair = pair.substring(1);
      
    const [ k, v ] = pair.split('=');
      if (k === key)
        return { k, v };
  });

  return undefined;
};

const setCookie = (key: string, value: string): void => {
    const date: Date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value}; expires=${ date.toUTCString() };`;
};

const deleteCookie = (key: string): void => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

export { getCookie, setCookie, deleteCookie };