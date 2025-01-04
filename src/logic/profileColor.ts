const getValues = (value: string): number[] => {
    const cast = (symbol: number): number => {
        if (symbol >= 0x30 && symbol <= 0x39) return symbol - 0x30;
        if (symbol >= 0x41 && symbol <= 0x5A) return symbol - 0x41 + 10;
        if (symbol >= 0x61 && symbol <= 0x7A) return symbol - 0x61 + 10 + 26;
        return 0;
    };

    const toRange = (value: number): number => Math.floor(value * (0xff / 0x7a) * 1.5);

    const convert = (value: number): number => toRange(cast(value));

    return Array.from({ length: 3 }, (_, i) => convert(value.charCodeAt(i)));
};

const toHex = (value: number, isReversed?: boolean): string =>
    Math.floor(
        isReversed
        ?   Math.min((255 - value) * 2, 255)
        :   value / 2
    )
        .toString(16)
        .padStart(2, '0');

const getColors = (value: string): [ string, string ] => {
    // no need to check for the length of the value,
    // because names are always at least 3 characters long
    const bytes = getValues(value);
    
    const color = bytes.map(byte => toHex(byte)).join('');
    const r_color = bytes.map(byte => toHex(byte, true)).join('');

    return [ `#${ color }`, `#${ r_color }` ];
};

export default getColors;