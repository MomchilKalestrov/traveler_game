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