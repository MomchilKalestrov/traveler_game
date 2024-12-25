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
    console.log(bytes)
    
    const red   = toHex(bytes[0]);
    const green = toHex(bytes[1]);
    const blue  = toHex(bytes[2]);

    const r_red   = toHex(bytes[0], true);
    const r_green = toHex(bytes[1], true);
    const r_blue  = toHex(bytes[2], true);

    console.log([ `#${red}${green}${blue}`, `#${r_red}${r_green}${r_blue}` ])
    return [ `#${red}${green}${blue}`, `#${r_red}${r_green}${r_blue}` ];
};

export default getColors;