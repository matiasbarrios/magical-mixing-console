import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    lanSetProvider,
    getLANInterfaces,
    getLocalAddressForIP,
} from '@magical-mixing/mixers/helpers/lan.js';

describe('lan provider facade', () => {
    beforeEach(() => {
        lanSetProvider({
            getLANBroadcastAddress: () => ([
                {
                    localAddress: '10.0.0.5',
                    broadcastAddress: '10.0.0.255',
                    interfaceName: 'en0',
                },
            ]),
            getLocalAddressForIP: (targetIp) => (
                targetIp?.startsWith('10.') ? '10.0.0.5' : null
            ),
        });
    });

    afterEach(() => {
        lanSetProvider(null);
    });

    it('reads interfaces from the injected provider', () => {
        expect(getLANInterfaces()).toEqual([{
            localAddress: '10.0.0.5',
            broadcastAddress: '10.0.0.255',
            interfaceName: 'en0',
        }]);
    });

    it('resolves local address for target IPs via provider', () => {
        expect(getLocalAddressForIP('10.0.0.20')).toBe('10.0.0.5');
        expect(getLocalAddressForIP('192.168.1.10')).toBeNull();
    });

    it('returns null when no provider is set', () => {
        lanSetProvider(null);
        expect(getLANInterfaces()).toBeNull();
        expect(getLocalAddressForIP('10.0.0.1')).toBeNull();
    });
});
