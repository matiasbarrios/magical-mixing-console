import { describe, it, expect } from 'vitest';
import { filterDuplicateLocalhostDevices } from '@magical-mixing/console/gui/helpers/foundDevices.js';

describe('filterDuplicateLocalhostDevices', () => {
    it('returns undefined or empty input unchanged', () => {
        expect(filterDuplicateLocalhostDevices(undefined)).toBeUndefined();
        expect(filterDuplicateLocalhostDevices([])).toEqual([]);
    });

    it('keeps only localhost when the same desk name appears on LAN and 127.0.0.1', () => {
        const devices = [
            { name: 'X18', ip: '127.0.0.1', port: 10023 },
            { name: 'X18', ip: '192.168.1.10', port: 10023 },
        ];
        expect(filterDuplicateLocalhostDevices(devices)).toEqual([
            { name: 'X18', ip: '127.0.0.1', port: 10023 },
        ]);
    });

    it('does not filter devices with different names', () => {
        const devices = [
            { name: 'X18', ip: '127.0.0.1', port: 10023 },
            { name: 'XR18', ip: '192.168.1.10', port: 10023 },
        ];
        expect(filterDuplicateLocalhostDevices(devices)).toEqual(devices);
    });
});
