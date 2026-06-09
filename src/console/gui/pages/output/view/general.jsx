// Requirements
import { Flex, IconButton } from '@radix-ui/themes';
import { useDevice, useOutputReset } from '@magical-mixing/mixers-react';
import ResetIcon from '../../../components/base/resetIcon';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { Alert } from '../../../components/base/alert';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { SourceViewSelect } from './source';
import { TapViewSelect } from './tap';


// Internal
const SourceRow = ({ outputId }) => {
    const { t } = useLanguage();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Source') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <SourceViewSelect outputId={outputId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const TapRow = ({ outputId }) => {
    const { t } = useLanguage();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Tap') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <TapViewSelect outputId={outputId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const ResetOutput = ({ outputId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useOutputReset(outputId);

    return (
        <Alert onAccept={reset} accept={t('Reset')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Reset')}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


// Exported
export default ({ outputId }) => (
    <>
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            <SourceRow outputId={outputId} />
            <TapRow outputId={outputId} />
        </LabelControlTable.List>
        <Flex align="center" justify="end" gap="1">
            <ResetOutput outputId={outputId} />
        </Flex>
    </>
);
