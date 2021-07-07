/**
 * Generate meta.cpp (see [BIKI enty](https://community.bistudio.com/wiki/Arma_3:_meta.cpp))
 * @param id Steam workshop item ID
 * @param name Name on workshop
 * @param [hashOverride] Hash Override value
 * @returns meta.cpp
 */
export function generateMetaCPP(id: number, name: string, hashOverride?: number): string {
    let metaCPP = '';
    const addAttribute = (key: string, value: string|number|BigInt, quote = false): void => {
        const quotes = quote ? '"' : '';
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        metaCPP += `${key} = ${quotes}${value}${quotes};\n`;
    };

    addAttribute('protocol', 1);
    addAttribute('publishedid', id);
    addAttribute('name', name, true);
    addAttribute('timestamp', generateTimestamp());
    if (hashOverride !== undefined) addAttribute('timestamp', hashOverride);

    return metaCPP;
}

const UNIX_TICKS = BigInt('621355968000000000');
const TICKS_PER_MS = BigInt(10000);

/**
 * Generate timestamp as if it would have been created with .NET's DateTime.toBinary method.
 * Basically following structure:
 *   - 2 Bits to store if Date is UTC / Local (and some more shit, which we do not need).
 *     This will always be '01' for us, because we only generate UTC timestamps.
 *   - 62 Bits "Ticks" since 1/1/0001 12:00am. 1ms = 1000 Ticks
 *
 * See [.NET source reference](https://github.com/microsoft/referencesource/blob/master/mscorlib/system/datetime.cs) for further details.
 * @param [date] Date to convert (default: current date)
 * @returns Timestamp
 */
export function generateTimestamp(date = new Date()): bigint {
    const ticksSinceUnix = BigInt(date.getTime()) * TICKS_PER_MS;
    const ticks = ticksSinceUnix + UNIX_TICKS;

    return BigInt(`0b01${ticks.toString(2).padStart(62, '0')}`);
}
