// Requirements
import {
    useCallback, useContext,
} from 'react';
import {
    Flex, Text,
} from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon, DividerVerticalIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { ICON_STYLE } from '../../../helpers/values';
import Link from '../../base/link';
import { HeaderIconButton } from '../header/iconButton';
import InstancePicker, { hasHeaderTrailInstancePicker } from './instance/picker';
import { HeaderTrailContextState } from './context';


// Constants
const headerTrailStyle = {
    maxWidth: 'calc(100dvw - 170px)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'clip',
};


const instanceStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'clip',
};


const InstanceArea = () => {
    const { headerTrail } = useContext(HeaderTrailContextState);

    if (!headerTrail?.instance) return null;

    if (hasHeaderTrailInstancePicker(headerTrail.instance)) {
        return (
            <>
                {!!headerTrail.entity && <DividerVerticalIcon color="gray" style={ICON_STYLE} />}
                <Flex align="center" style={instanceStyle}>
                    <InstancePicker instance={headerTrail.instance} />
                </Flex>
            </>
        );
    }

    return (
        <>
            {!!headerTrail.entity && <DividerVerticalIcon color="gray" style={ICON_STYLE} />}
            <Flex align="center" style={instanceStyle}>
                <Text size="2" color={headerTrail.instance.color || 'gray'} mx="2">
                    {headerTrail.instance.name}
                </Text>
            </Flex>
        </>
    );
};


// Exported
export const useHeaderTrail = () => {
    const { headerTrail, setHeaderTrail } = useContext(HeaderTrailContextState);
    return { headerTrail, setHeaderTrail };
};


export const HeaderTrail = () => {
    const { disabled } = useDevice();
    const { headerTrail } = useHeaderTrail();

    if (disabled) return null;
    if (!headerTrail?.entity && !hasHeaderTrailInstancePicker(headerTrail?.instance)) return null;

    return (
        <Flex align="center" style={headerTrailStyle}>
            {headerTrail.entity?.link && (
                <Link to={headerTrail.entity.link} variant="ghost" color="gray">
                    {headerTrail.entity.name}
                </Link>
            )}
            {headerTrail.entity && !headerTrail.entity.link && (
                <Text size="2" color="gray" mx="2">{headerTrail.entity.name}</Text>
            )}
            <InstanceArea />
        </Flex>
    );
};


export const HeaderTrailActions = () => {
    const { disabled } = useDevice();
    const { headerTrail } = useHeaderTrail();

    if (disabled) return null;
    if (!headerTrail?.actions) return null;

    return headerTrail.actions;
};


export const HeaderTrailNavigation = () => {
    const { disabled } = useDevice();
    const { headerTrail } = useHeaderTrail();
    const navigate = useNavigate();

    const gotToPrevious = useCallback(() => {
        navigate(headerTrail.previous);
    }, [headerTrail, navigate]);

    const gotToNext = useCallback(() => {
        navigate(headerTrail.next);
    }, [headerTrail, navigate]);

    if (disabled) return null;
    if (!headerTrail?.previous && !headerTrail?.next) return null;

    return (
        <>
            <HeaderIconButton onClick={gotToPrevious} disabled={!headerTrail.previous}>
                <ChevronLeftIcon style={ICON_STYLE} />
            </HeaderIconButton>
            <HeaderIconButton onClick={gotToNext} disabled={!headerTrail.next}>
                <ChevronRightIcon style={ICON_STYLE} />
            </HeaderIconButton>
        </>
    );
};
