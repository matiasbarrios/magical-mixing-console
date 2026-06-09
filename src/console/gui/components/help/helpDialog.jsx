// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
    Box, Dialog, Flex, Heading, Text,
} from '@radix-ui/themes';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';
import DialogHeader from '../base/dialogHeader';


// Constants
const dialogStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85dvh',
    overflow: 'hidden',
};


const SECTIONS = [
    { id: 'overview', title: 'The big picture' },
    { id: 'bus', title: 'What is a bus?' },
    { id: 'input', title: 'What is an input?' },
    { id: 'output', title: 'What is an output?' },
    { id: 'signal-flow', title: 'Signal flow' },
    { id: 'from-to', title: 'Reception and Sends' },
    { id: 'fx-effect', title: 'FX and Effect bus' },
    { id: 'more', title: 'Other concepts' },
];


// Internal
const Callout = ({ children }) => (
    <Box className="mmc-help-callout">
        { children }
    </Box>
);


const Flow = ({ children }) => (
    <Box asChild className="mmc-help-flow">
        <pre>{ children }</pre>
    </Box>
);


const Section = ({ id, title, children, setRef }) => (
    <Box id={id} ref={setRef} className="mmc-help-section">
        <Heading as="h2" size="3" mb="2">
            { title }
        </Heading>
        { children }
    </Box>
);


const HelpContent = ({ t, textSize, setSectionRef }) => (
    <>
        <Section
            id="help-overview"
            setRef={setSectionRef('overview')}
            title={t('The big picture')}
        >
            <Text as="p" size={textSize} color="gray">
                { t('A digital mixer takes audio sources, mixes them on buses, processes them, and sends the result to physical outputs. MMC organizes the desk as separate related entities — they are not interchangeable.') }
            </Text>
            <Callout>
                <Text size={textSize}>
                    { t('The most common confusion: an input is not a bus, and a bus is not an output. They are three distinct steps in the signal chain.') }
                </Text>
            </Callout>
        </Section>

        <Section id="help-bus" setRef={setSectionRef('bus')} title={t('What is a bus?')}>
            <Text as="p" size={textSize} color="gray">
                { t('A bus is a mix channel — where you do almost all your work: level, pan, mute, EQ, compressor, sends, and more.') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('Each bus has a type. On X Air desks, for example:') }
            </Text>
            <Box asChild mt="2" className="mmc-help-list">
                <ul>
                    <li><Text size={textSize} color="gray">{ t('Channel: main input channel.') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Aux bus: submix.') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Main: main L/R mix.') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Effect return: return from an effects processor.') }</Text></li>
                </ul>
            </Box>
        </Section>

        <Section id="help-input" setRef={setSectionRef('input')} title={t('What is an input?')}>
            <Text as="p" size={textSize} color="gray">
                { t('An input is a source — the physical or logical point where audio enters the desk (preamp, line, USB). It has its own settings: gain, phantom power, trim, etc.') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('Which input feeds each bus is configured per bus (bus screen → Input) or from the input side (which buses use this source).') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('The same input can feed several buses at once.') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('An input can also feed an output directly, without going through a bus — configured from the input screen (Outputs) or by choosing the input as an output source.') }
            </Text>
            <Callout>
                <Text size={textSize}>
                    { t('Input = where audio comes from. Bus = where you mix it. They are different things linked by assignment.') }
                </Text>
            </Callout>
        </Section>

        <Section id="help-output" setRef={setSectionRef('output')} title={t('What is an output?')}>
            <Text as="p" size={textSize} color="gray">
                { t('An output is a physical destination — where audio leaves the desk: main L/R, headphones, analog outputs, USB, and ultranet (P16 personal monitor outputs).') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('Each output has one source (a bus, FX return, USB input, or direct input) and a level. A single bus can feed multiple outputs at once. Buses send to outputs — not the other way around.') }
            </Text>
        </Section>

        <Section id="help-signal-flow" setRef={setSectionRef('signal-flow')} title={t('Signal flow')}>
            <Text as="p" size={textSize} color="gray">
                { t('Typical live path:') }
            </Text>
            <Flow>{ t('Microphone → Input (preamp) → Channel bus → Main bus → Output (main L/R)') }</Flow>
            <Text as="p" size={textSize} color="gray" mt="3">
                { t('Monitor aux example:') }
            </Text>
            <Flow>{ t('Input USB → Channel bus → Output (analog output)') }</Flow>
            <Text as="p" size={textSize} color="gray" mt="3">
                { t('Ultranet (P16) example:') }
            </Text>
            <Flow>{ t('Channel bus → Aux bus → Output (ultranet / P16)') }</Flow>
            <Text as="p" size={textSize} color="gray" mt="3">
                { t('Direct input example:') }
            </Text>
            <Flow>{ t('Input USB → Output (analog output)') }</Flow>
            <Text as="p" size={textSize} color="gray" mt="3">
                { t('Effects example:') }
            </Text>
            <Flow>{ t('Channel bus → FX processor → Effect bus → Main bus → Output') }</Flow>
        </Section>

        <Section id="help-from-to" setRef={setSectionRef('from-to')} title={t('Reception and Sends')}>
            <Text as="p" size={textSize} color="gray">
                { t('On every bus screen, MMC shows two mirror views of routing between buses — the Sends and Reception tabs:') }
            </Text>
            <Text as="p" size={textSize} weight="medium" mt="3">
                { t('Reception') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="1">
                { t('"What sends into this bus?" The inverse view: all buses with an active send to the current bus. DCAs also appear here.') }
            </Text>
            <Text as="p" size={textSize} weight="medium" mt="3">
                { t('Sends') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="1">
                { t('"Where does this bus send?" Configure sends to aux buses, effects, main, and monitor.') }
            </Text>
            <Callout>
                <Text size={textSize}>
                    { t('Buses can also send into other buses, but which routes exist depends on bus type — not every bus can receive from every other. MMC only shows valid paths for each bus.') }
                </Text>
            </Callout>
        </Section>

        <Section id="help-fx-effect" setRef={setSectionRef('fx-effect')} title={t('FX and Effect bus')}>
            <Callout>
                <Text size={textSize}>
                    { t('They are two different things in the same chain: FX processes the audio; the Effect bus is the mix channel where that processed audio returns to the mix.') }
                </Text>
            </Callout>
            <Text as="p" size={textSize} color="gray" mt="3">
                { t('FX is the effects processor — reverb, delay, and so on. There you choose the effect type and its parameters (decay, mix, feedback…). It is not a mix channel: it is the engine that processes the signal.') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('The Effect bus is a return channel. It is a normal mix channel — fader, pan, mute, sends to main and aux — carrying the already processed signal back into the mix.') }
            </Text>
            <Text as="p" size={textSize} color="gray" mt="3">
                { t('On X Air desks they come in matched pairs — one FX processor per Effect bus:') }
            </Text>
            <Flow>{ t('FX 1  ↔  Effect bus 1 (FX rtn 1)\nFX 2  ↔  Effect bus 2\n…') }</Flow>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('They are not interchangeable: configuring FX 1 does not change FX 3, and raising the Effect bus 2 fader does not change the reverb parameters.') }
            </Text>
            <Flow>{ t('Channel bus → send → FX processor → Effect bus → Main bus → Output\n         (dry)              (wet return)') }</Flow>
            <Text as="p" size={textSize} color="gray" mt="2">
                { t('The channel send drives signal into the FX. The Effect bus is where the processed signal leaves for the rest of the desk.') }
            </Text>
            <Text as="p" size={textSize} weight="medium" mt="3">
                { t('Where to find each in MMC:') }
            </Text>
            <Box asChild mt="2" className="mmc-help-list">
                <ul>
                    <li><Text size={textSize} color="gray">{ t('Change effect type or parameters → FX (menu → FXs)') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Ride the effect level in the mix, pan it, send it to main → Effect bus (menu → Buses → Effect)') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Send more signal from a vocal into the effect → Channel bus → Sends (send to FX)') }</Text></li>
                </ul>
            </Box>
            <Callout>
                <Text size={textSize}>
                    { t('"I want more reverb on the vocal" can mean three different things: more send from the channel, more level on the Effect bus, or different parameters on the FX. Three controls on three different screens.') }
                </Text>
            </Callout>
        </Section>

        <Section id="help-more" setRef={setSectionRef('more')} title={t('Other concepts')}>
            <Text as="p" size={textSize} color="gray">
                { t('Other concepts you will see in the menu:') }
            </Text>
            <Box asChild mt="2" className="mmc-help-list">
                <ul>
                    <li><Text size={textSize} color="gray">{ t('DCA: level group — moves several faders together without mixing audio.') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Mute group: mutes several buses at once.') }</Text></li>
                    <li><Text size={textSize} color="gray">{ t('Scene: snapshot of mixer state (on the device or saved in the app).') }</Text></li>
                </ul>
            </Box>
        </Section>
    </>
);


// Exported
export default ({ open, onOpenChange }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const scrollRef = useRef(null);
    const sectionRefs = useRef({});
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    const sectionTitle = useCallback((id) => {
        const section = SECTIONS.find(s => s.id === id);
        return section ? t(section.title) : id;
    }, [t]);

    const setSectionRef = useCallback(id => (el) => {
        sectionRefs.current[id] = el;
    }, []);

    const scrollToSection = useCallback((id) => {
        const el = sectionRefs.current[id];
        const container = scrollRef.current;
        if (!el || !container) return;
        setActiveSection(id);
        container.scrollTo({
            top: el.offsetTop - container.offsetTop,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        if (!open) {
            setActiveSection(SECTIONS[0].id);
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }
    }, [open]);

    const toc = useMemo(() => SECTIONS.map(({ id }) => (
        <button
            key={id}
            type="button"
            className="mmc-help-toc-link"
            data-active={activeSection === id}
            onClick={() => scrollToSection(id)}
        >
            { sectionTitle(id) }
        </button>
    )), [activeSection, scrollToSection, sectionTitle]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content
                aria-describedby={undefined}
                maxWidth="720px"
                className="mmc-help-dialog"
                style={dialogStyle}
            >
                <DialogHeader mb="3">
                    { t('Help!') }
                </DialogHeader>
                <Flex className="mmc-help-body" flexGrow="1" minHeight="0" width="100%">
                    <Box className="mmc-help-toc" aria-label={t('Contents')}>
                        { toc }
                    </Box>
                    <Flex
                        ref={scrollRef}
                        direction="column"
                        flexGrow="1"
                        minHeight="0"
                        className="mmc-help-content mmc-scroll-y"
                    >
                        <HelpContent
                            t={t}
                            textSize={textSize}
                            setSectionRef={setSectionRef}
                        />
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
