// Requirements
import { useMemo, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import { DropdownSelect } from '../../components/base/dropdownSelect';
import { useFallbackBusColor } from '../../components/fallback';
import { BusIconNameLabeled } from '../bus/view/name';
import { BlockingProvider, useBlockingCount } from './blocking';
import { Meters } from './meters';
import { Checks } from './checks';


// Internal
const ChannelOption = ({ busId, selected }) => (
    <DropdownSelect.Option id={busId} selected={selected}>
        <BusIconNameLabeled busId={busId} size="2" />
    </DropdownSelect.Option>
);


const Summary = () => {
    const count = useBlockingCount();
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    let message = t('Nothing in the mixer is blocking this channel');
    if (count === 1) message = `1 ${t('thing is blocking sound on Main')}`;
    else if (count > 1) message = `${count} ${t('things are blocking sound on Main')}`;

    return (
        <Text size={textSize} weight="medium" color={count > 0 ? 'red' : 'gray'}>
            { message }
        </Text>
    );
};


const ChannelPicker = ({ channelId, channels, setChannelId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { value: color } = useFallbackBusColor(channelId, 'gray');

    if (channelId == null) return null;

    return (
        <Flex align="center" justify="between" gap="3">
            <Text size={textSize}>{ t('Select channel for testing') }</Text>
            <DropdownSelect.Root set={setChannelId}>
                <DropdownSelect.Trigger square variant="soft" color={color}>
                    <BusIconNameLabeled busId={channelId} />
                </DropdownSelect.Trigger>
                <DropdownSelect.Content>
                    {channels.map(channel => (
                        <ChannelOption
                            key={channel.id}
                            busId={channel.id}
                            selected={channel.id === channelId}
                        />
                    ))}
                </DropdownSelect.Content>
            </DropdownSelect.Root>
        </Flex>
    );
};


const ChecklistBody = ({ channelId, channels, setChannelId }) => (
    <BlockingProvider>
        <Flex direction="column" gap="3">
            <Summary />
            <ChannelPicker
                channelId={channelId}
                channels={channels}
                setChannelId={setChannelId}
            />
            {channelId != null && (
                <>
                    <Meters busId={channelId} />
                    <Checks busId={channelId} />
                </>
            )}
        </Flex>
    </BlockingProvider>
);


const MainSoundChecklist = () => {
    const { ofType } = useBusOptions();
    const channels = useMemo(() => [
        ...ofType('channel'),
        ...ofType('line'),
    ], [ofType]);
    const [channelId, setChannelId] = useState(channels[0]?.id);

    return (
        <ChecklistBody
            channelId={channelId}
            channels={channels}
            setChannelId={setChannelId}
        />
    );
};


// Exported
export { MainSoundChecklist };
