export const getBadgeSVG = (name: string): string =>
    `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ name }.svg`;

export const getAlignment = (count: number): React.CSSProperties => ({
    justifyContent: count > 3
    ?   'space-between'
    :   count === 2
        ?   'space-around'
        :   'center'
});

export const getPercentage = (xp: number): React.CSSProperties => ({
    '--percentage': `${ xp - 100 * Math.floor(xp / 100) }%`
} as React.CSSProperties);

const getNumberWithSuffix = (number: number): string => {
    switch(number % 10) {
        case 1:  return `${ number }st`;
        case 2:  return `${ number }nd`;
        case 3:  return `${ number }rd`;
        default: return `${ number }th`;
    };
};

const months: { [ key: number ]: string } = {
    0:  'Jan',
    1:  'Feb',
    2:  'Mar',
    3:  'Apr',
    4:  'May',
    5:  'Jun',
    6:  'Jul',
    7:  'Aug',
    8:  'Sep',
    9:  'Oct',
    10: 'Nov',
    11: 'Dec'
};

export const unixToDate = (unix: number) => {
    const date = new Date(unix);
    return `${ getNumberWithSuffix(date.getDate()) } ${ months[ date.getMonth() ] } ${ date.getFullYear() }`;
};

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
}

export const findAndReplace = <T>(
    arr: T[],
    predicate: (item: T) => boolean,
    replacer: (item: T) => T
): T[] => arr.map<T>((item) => predicate(item) ? replacer(item) : item);