import { generateTimestamp } from '../src/metaCPP';

describe('generateTimestamp', () => {
    test('Can convert future dates', async () => {
        const d = new Date('2142-01-01 13:37:00.000Z');
        expect(generateTimestamp(d)).toBe(BigInt('5287320684627387904'))
    });
    
    test('Can convert past dates', async () => {
        const d = new Date('2014-08-10 13:37:00.000Z');
        expect(generateTimestamp(d)).toBe(BigInt('5247118764627387904'))
    });

    test('Can convert dates before unix epoch', async () => {
        const d = new Date('1944-06-6 06:30:00.000Z');
        expect(generateTimestamp(d)).toBe(BigInt('5224972460427387904'))
    });

    test('Can convert current date', async () => {
        const expected = generateTimestamp(new Date());
        const currentTimeStamp = generateTimestamp();

        const diff = Math.abs(Number(expected - currentTimeStamp));

        // 10000 ticks is 1ms, theoretically both should be the exact same => diff = 0
        // be we accept up to 1ms difference
        expect(diff).toBeLessThan(10000)
    });
})

  