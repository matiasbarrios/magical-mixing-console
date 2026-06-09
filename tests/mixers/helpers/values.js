import { describe, it, expect } from 'vitest';
import {
    isInt,
    isFloat,
    isValidIP,
    isValidPort,
    pad,
    booleanToBinary,
    binaryToBoolean,
    notBooleanToBinary,
    notBinaryToBoolean,
    objectFlip,
    decimalToHundredRange,
    hundredRangeToDecimal,
} from '@magical-mixing/mixers/helpers/values.js';

describe('isInt', () => {
    it('accepts integers and rejects non-integers', () => {
        expect(isInt(3)).toBe(true);
        expect(isInt(0)).toBe(true);
        expect(isInt(3.1)).toBe(false);
        expect(isInt('3')).toBe(false);
    });
});

describe('isValidIP', () => {
    it('accepts valid IPv4 addresses', () => {
        expect(isValidIP('192.168.0.1')).toBe(true);
        expect(isValidIP('127.0.0.1')).toBe(true);
    });

    it('rejects invalid IPv4 addresses', () => {
        expect(isValidIP('256.0.0.0')).toBe(false);
        expect(isValidIP('not-an-ip')).toBe(false);
    });
});

describe('isFloat', () => {
    it('accepts floats and rejects integers', () => {
        expect(isFloat(3.1)).toBe(true);
        expect(isFloat(3)).toBe(false);
    });
});

describe('isValidPort', () => {
    it('accepts UDP port range', () => {
        expect(isValidPort(1)).toBe(true);
        expect(isValidPort(10024)).toBe(true);
        expect(isValidPort(0)).toBe(false);
    });
});

describe('pad', () => {
    it('zero-pads single-digit numbers', () => {
        expect(pad(1)).toBe('01');
        expect(pad(12)).toBe('12');
    });
});

describe('boolean/binary converters', () => {
    it('converts booleans to 0/1 and back', () => {
        expect(booleanToBinary(true)).toBe(1);
        expect(booleanToBinary(false)).toBe(0);
        expect(binaryToBoolean(1)).toBe(true);
        expect(binaryToBoolean(0)).toBe(false);
    });

    it('converts inverted booleans', () => {
        expect(notBooleanToBinary(true)).toBe(0);
        expect(notBinaryToBoolean(0)).toBe(true);
    });
});

describe('objectFlip', () => {
    it('swaps object keys and values', () => {
        expect(objectFlip({ a: '1', b: '2' })).toEqual({ 1: 'a', 2: 'b' });
    });
});

describe('decimalToHundredRange / hundredRangeToDecimal', () => {
    it('round-trips between decimal and hundred range', () => {
        expect(decimalToHundredRange(0.5)).toBe(0);
        expect(hundredRangeToDecimal(0)).toBe(0.5);
        expect(decimalToHundredRange(1)).toBe(100);
        expect(decimalToHundredRange(0)).toBe(-100);
    });
});
