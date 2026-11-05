// @vitest-environment happy-dom
import {
    cleanup, fireEvent, render, screen, waitFor, within,
} from '@testing-library/react';
import {
    afterAll, afterEach, beforeAll, describe, expect, it,
} from 'vitest';
import { DeviceProvider } from '@magical-mixing/mixers-react';
import { translationInitialize } from '@magical-mixing/console/gui/components/language/translations/index.js';
import { LanguageProvider } from '@magical-mixing/console/gui/components/language/index.jsx';
import { ThemeProvider } from '@magical-mixing/console/gui/components/theme.jsx';
import { FallbackProvider } from '@magical-mixing/console/gui/components/fallback/context.jsx';
import TroubleshootingDialog from '@magical-mixing/console/gui/pages/troubleshooting/dialog.jsx';
import {
    connectToVirtualX18,
    featureGet,
    wait,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from '../../../mixers/integration/bus/setup.js';

const MAIN_BUS_ID = 27;
const CHANNEL_ID = 0;


const rowOf = (label) => {
    const node = screen.getByText(label);
    return node.parentElement.parentElement.parentElement;
};


const renderDialog = (device) => render(
    <ThemeProvider>
        <LanguageProvider>
            <DeviceProvider device={device}>
                <FallbackProvider>
                    <TroubleshootingDialog open onOpenChange={() => {}} />
                </FallbackProvider>
            </DeviceProvider>
        </LanguageProvider>
    </ThemeProvider>,
);


describe('troubleshooting checklist against virtual X18', () => {
    useVirtualX18();

    let device;

    beforeAll(async () => {
        window.matchMedia = () => ({
            matches: false,
            media: '',
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        });
        await translationInitialize('en');
        device = await connectToVirtualX18();
    });

    afterEach(() => {
        cleanup();
    });

    afterAll(async () => {
        if (device) await device.dispose();
    });

    it('walks the topic list and corrects what blocks Main', async () => {
        const { bus, input } = device.features;

        renderDialog(device);

        expect(screen.getByText("Can't get sound on Main")).toBeInTheDocument();
        fireEvent.click(await screen.findByRole('button', { name: 'Diagnose' }));

        expect(await screen.findByText('Select channel for testing')).toBeInTheDocument();
        expect(await screen.findByText('Phantom', {}, { timeout: 8000 })).toBeInTheDocument();
        expect(screen.getByText('Turn phantom on only if the microphone needs it')).toBeInTheDocument();
        expect(within(rowOf('Phantom')).getByRole('button', { name: '48v' })).toBeInTheDocument();
        expect(within(rowOf('Gain')).getByRole('slider')).toBeInTheDocument();
        expect(within(rowOf('Channel pan')).getByRole('slider')).toBeInTheDocument();
        expect(within(rowOf('Main pan')).getByRole('slider')).toBeInTheDocument();
        expect(screen.getByText('Input meter')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Turn off' }).length).toBeGreaterThan(0);
        expect(screen.queryByText('Speakers plug into the Main L/R outputs. The cable and the amplifier are outside the mixer.')).not.toBeInTheDocument();

        bus.mute.set(CHANNEL_ID, true);
        bus.level.set(CHANNEL_ID, -90);
        bus.to.on.set(CHANNEL_ID, MAIN_BUS_ID, false);

        await waitFor(() => {
            expect(rowOf('Channel mute')).toHaveTextContent('Muted');
            expect(rowOf('Channel level')).toHaveTextContent('-90');
            expect(rowOf('Send to Main')).toHaveTextContent('Off');
        }, { timeout: 8000 });

        fireEvent.click(within(rowOf('Channel mute')).getByRole('button', { name: 'Muted' }));
        fireEvent.doubleClick(within(rowOf('Channel level')).getByRole('slider'));
        fireEvent.click(within(rowOf('Send to Main')).getByRole('button', { name: 'Fix' }));
        fireEvent.click(within(rowOf('Equalizer')).getByRole('button', { name: 'Turn off' }));
        fireEvent.click(within(rowOf('Compressor')).getByRole('button', { name: 'Turn off' }));
        fireEvent.click(within(rowOf('Gate')).getByRole('button', { name: 'Turn off' }));

        await waitFor(() => {
            expect(rowOf('Channel mute')).toHaveTextContent('Unmuted');
            expect(rowOf('Channel level')).toHaveTextContent('+0.0');
            expect(rowOf('Send to Main')).toHaveTextContent('On');
            expect(rowOf('Equalizer')).toHaveTextContent('Off');
            expect(rowOf('Compressor')).toHaveTextContent('Off');
            expect(rowOf('Gate')).toHaveTextContent('Off');
        }, { timeout: 8000 });

        await wait(1200);
        expect(await featureGet(bus.mute, CHANNEL_ID)).toBe(false);
        expect(await featureGet(bus.level, CHANNEL_ID)).toBeCloseTo(0, 0);
        expect(await featureGet(bus.to.on, CHANNEL_ID, MAIN_BUS_ID)).toBe(true);
        expect(await featureGet(bus.equalizer.on, CHANNEL_ID)).toBe(false);
        expect(await featureGet(bus.compressor.on, CHANNEL_ID)).toBe(false);
        expect(await featureGet(bus.gate.on, CHANNEL_ID)).toBe(false);
        expect(await featureGet(input.phantom, CHANNEL_ID)).toBe(false);

        const channelButton = screen.getByRole('button', { name: 'Ch 1 Vocal 1' });
        expect(channelButton).toHaveAttribute('data-accent-color', 'blue');

        bus.mute.set(1, true);
        fireEvent.click(channelButton);
        fireEvent.click(await screen.findByRole('menuitem', { name: 'Ch 2 Vocal 2' }));

        await waitFor(() => {
            expect(rowOf('Channel mute')).toHaveTextContent('Muted');
        }, { timeout: 8000 });

        fireEvent.click(screen.getByRole('button', { name: 'Ch 2 Vocal 2' }));
        fireEvent.click(await screen.findByRole('menuitem', { name: 'Ch 1 Vocal 1' }));

        await waitFor(() => {
            expect(rowOf('Channel mute')).toHaveTextContent('Unmuted');
        }, { timeout: 8000 });

        fireEvent.click(screen.getByRole('button', { name: 'Ch 1 Vocal 1' }));
        fireEvent.click(await screen.findByRole('menuitem', { name: 'Ln 17/18 Mobile' }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Ln 17/18 Mobile' })).toBeInTheDocument();
            expect(screen.queryByText('Gate')).not.toBeInTheDocument();
            expect(screen.queryByText('Compressor')).not.toBeInTheDocument();
            expect(screen.queryByText('Phantom')).not.toBeInTheDocument();
            expect(screen.queryByText('Insert')).not.toBeInTheDocument();
            expect(screen.getByText('Equalizer')).toBeInTheDocument();
            expect(screen.getByText('Channel level')).toBeInTheDocument();
        }, { timeout: 8000 });

        expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Diagnose' })).not.toBeInTheDocument();
    }, 30000);
});
