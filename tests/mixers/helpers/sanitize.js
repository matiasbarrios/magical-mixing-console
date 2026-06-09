import { describe, it, expect } from 'vitest';
import { sanitizeString } from '@magical-mixing/mixers/helpers/sanitize.js';

describe('sanitizeString', () => {
    it('strips HTML tags', () => {
        expect(sanitizeString('<b>channel</b>')).toBe('channel');
        expect(sanitizeString('<span>safe</span>')).toBe('safe');
    });

    it('returns non-strings unchanged', () => {
        expect(sanitizeString(42)).toBe(42);
        expect(sanitizeString(null)).toBe(null);
    });
});
