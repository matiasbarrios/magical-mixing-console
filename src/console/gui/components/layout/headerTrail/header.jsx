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
import { useTheme, useUiSize } from '../../theme';
import Link from '../../base/link';
import { HeaderIconButton } from '../header/iconButton';
import InstancePicker, { hasHeaderTrailInstancePicker } from './instance/picker';
import { HeaderTrailContext } from './context';


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


const headerCenterStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(calc(100dvw - 260px), 720px)',
    maxWidth: 'min(calc(100dvw - 260px), 720px)',
    minWidth: 0,
    overflow: 'hidden',
    pointerEvents: 'auto',
};


const InstanceArea = () => {
    const { textSize } = useUiSize();
    const { headerTrail } = useContext(HeaderTrailContext);

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
                <Text size={textSize} color={headerTrail.instance.color || 'gray'} mx="2">
                    {headerTrail.instance.name}
                </Text>
            </Flex>
        </>
    );
};


// Exported
export const useHeaderTrail = () => {
    const { headerTrail, setHeaderTrail } = useContext(HeaderTrailContext);
    return { headerTrail, setHeaderTrail };
};


export const HeaderTrail = () => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { headerTrail } = useHeaderTrail();

    if (disabled) return null;
    if (!headerTrail?.entity && !hasHeaderTrailInstancePicker(headerTrail?.instance)) return null;

    return (
        <Flex align="center" style={headerTrailStyle}>
            {headerTrail.entity?.link && (
                <Link to={headerTrail.entity.link} variant="ghost" color="gray" size={textSize}>
                    {headerTrail.entity.name}
                </Link>
            )}
            {headerTrail.entity && !headerTrail.entity.link && (
                <Text size={textSize} color="gray" mx="2">{headerTrail.entity.name}</Text>
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


export const HeaderTrailCenter = () => {
    const { disabled } = useDevice();
    const { headerTrail } = useHeaderTrail();

    if (disabled) return null;
    if (!headerTrail?.center) return null;

    return (
        <Flex align="center" justify="center" style={headerCenterStyle}>
            { headerTrail.center }
        </Flex>
    );
};


export const HeaderTrailNavigation = () => {
    const { disabled } = useDevice();
    const { headerNavigation } = useTheme();
    const { headerTrail } = useHeaderTrail();
    const navigate = useNavigate();

    const gotToPrevious = useCallback(() => {
        navigate(headerTrail.previous);
    }, [headerTrail, navigate]);

    const gotToNext = useCallback(() => {
        navigate(headerTrail.next);
    }, [headerTrail, navigate]);

    if (disabled) return null;
    if (!headerNavigation) return null;
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
