import { describe, it, expect } from 'vitest';
import { configuration } from '@magical-mixing/mixers/drivers/xair/device/configuration/index.js';
import { networkAccessPoint } from '@magical-mixing/mixers/drivers/xair/device/configuration/networkAccessPoint.js';
import { networkWifiClient } from '@magical-mixing/mixers/drivers/xair/device/configuration/networkWifiClient.js';


const io = {
    read: () => undefined,
    get: () => () => {},
    set: () => {},
    setBatch: () => {},
};


const accessPoint = (model, firmware) => networkAccessPoint({
    ...io, model, firmware,
});


const wifiClient = (model, firmware) => networkWifiClient({
    ...io, model, firmware,
});


const optionValues = options => options.map(option => [option.name, option.value]);


const modelsV2 = ['X18V2', 'XR18V2', 'MR18V2', 'XR16V2', 'XR12V2', 'MR12V2'];


const modelsV1 = ['X18', 'XR18', 'MR18', 'XR16', 'XR12', 'MR12'];


describe('xAir Wi-Fi security options', () => {
    it('keeps access point security at Open and WEP outside v2 firmware 1.14 and later', () => {
        modelsV1.forEach(model => {
            expect(optionValues(accessPoint(model, '1.20').securityType.options)).toEqual([
                ['Open', 0],
                ['WEP', 1],
            ]);
        });

        expect(optionValues(accessPoint('XR18V2', '1.13').securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
        ]);
        expect(optionValues(accessPoint('XR18V2', undefined).securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
        ]);
        expect(optionValues(accessPoint('XR18V2', '1.14.1').securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
        ]);
    });

    it('adds WPA and WPA2 on v2 desks with firmware 1.14 and later', () => {
        modelsV2.forEach(model => {
            ['1.14', '1.20', '1.26', '1.27', ' 1.22 '].forEach(firmware => {
                expect(optionValues(accessPoint(model, firmware).securityType.options)).toEqual([
                    ['Open', 0],
                    ['WEP', 1],
                    ['WPA', 2],
                    ['WPA2', 3],
                ]);
            });
        });
    });

    it('sizes the access point key like the client only when WPA or WPA2 exist', () => {
        const legacy = accessPoint('X18', '1.22').key;
        expect(legacy.minLength).toBe(13);
        expect(legacy.maxLength).toBe(13);
        expect(legacy.hideIf({ 'networkAccessPoint-securityType': 0 })).toBe(true);
        expect(legacy.hideIf({ 'networkAccessPoint-securityType': 1 })).toBe(false);

        const extended = accessPoint('X18V2', '1.14').key;
        const wep = { 'networkAccessPoint-securityType': 1 };
        const wpa = { 'networkAccessPoint-securityType': 2 };
        const wpa2 = { 'networkAccessPoint-securityType': 3 };
        expect(extended.minLength(wep)).toBe(13);
        expect(extended.maxLength(wep)).toBe(13);
        expect(extended.minLength(wpa)).toBe(1);
        expect(extended.maxLength(wpa)).toBe(32);
        expect(extended.minLength(wpa2)).toBe(1);
        expect(extended.maxLength(wpa2)).toBe(32);
        expect(extended.hideIf({ 'networkAccessPoint-securityType': 0 })).toBe(true);
        expect(extended.hideIf(wpa2)).toBe(false);
    });

    it('keeps client security through WPA2 outside v2 firmware 1.14 and later', () => {
        expect(optionValues(wifiClient('MR12', '1.26').securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
            ['WPA', 2],
            ['WPA2', 3],
        ]);
        expect(optionValues(wifiClient('MR12V2', null).securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
            ['WPA', 2],
            ['WPA2', 3],
        ]);
    });

    it('adds WPA3 on v2 desks with firmware 1.14 and later', () => {
        modelsV2.forEach(model => {
            ['1.26', '1.27'].forEach(firmware => {
                expect(optionValues(wifiClient(model, firmware).securityType.options)).toEqual([
                    ['Open', 0],
                    ['WEP', 1],
                    ['WPA', 2],
                    ['WPA2', 3],
                    ['WPA3', 4],
                ]);
            });
        });

        const key = wifiClient('XR16V2', '1.14').key;
        expect(key.minLength({ 'networkWifiClient-securityType': 1 })).toBe(13);
        expect(key.maxLength({ 'networkWifiClient-securityType': 1 })).toBe(13);
        expect(key.minLength({ 'networkWifiClient-securityType': 4 })).toBe(1);
        expect(key.maxLength({ 'networkWifiClient-securityType': 4 })).toBe(32);
        expect(key.hideIf({ 'networkWifiClient-securityType': 0 })).toBe(true);
    });

    it('receives model and firmware through configuration()', () => {
        const extended = configuration({
            ...io, model: 'MR18V2', firmware: '1.15',
        });
        const legacy = configuration({
            ...io, model: 'MR18', firmware: '1.15',
        });

        expect(optionValues(extended.networkAccessPoint.securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
            ['WPA', 2],
            ['WPA2', 3],
        ]);
        expect(optionValues(extended.networkWifiClient.securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
            ['WPA', 2],
            ['WPA2', 3],
            ['WPA3', 4],
        ]);
        expect(optionValues(legacy.networkAccessPoint.securityType.options)).toEqual([
            ['Open', 0],
            ['WEP', 1],
        ]);
        expect(legacy.networkWifiClient.securityType.options.some(option => option.name === 'WPA3'))
            .toBe(false);
    });
});
