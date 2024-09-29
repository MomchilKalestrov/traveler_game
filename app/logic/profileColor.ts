const toHex = (value: number, isReversed?: boolean): string =>
    Math.floor(isReversed ? 270 - value : value * 0.8).toString(16).padStart(2, '0');

const getColors = (value: string): Array<string> => {
    // no need to check for the length of the value,
    // because names are always at least 3 characters long
    const bytes = new TextEncoder().encode(value);
    
    const red   = toHex(bytes[0]);
    const green = toHex(bytes[1]);
    const blue  = toHex(bytes[2]);

    const r_red     = toHex(bytes[0], true);
    const r_green   = toHex(bytes[1], true);
    const r_blue    = toHex(bytes[2], true);


    return [ `#${red}${green}${blue}`, `#${r_red}${r_green}${r_blue}` ];
};

export default getColors;