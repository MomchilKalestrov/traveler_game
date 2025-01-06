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