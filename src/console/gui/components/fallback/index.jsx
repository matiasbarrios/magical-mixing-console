// Requirements
import { FallbackProvider } from './context';
import { useFallbackBusColors, useFallbackBusColor } from './bus/color';
import {
    useFallbackBusDca, FallbackBusDcaOn, FallbackBusDcaUnassignAllOf,
    useFallbackBusDcaUnassignAllOfAll,
} from './bus/dca';
import { useFallbackBusIcons, useFallbackBusIcon, FallbackBusIcon } from './bus/icon';
import {
    useFallbackBusMg, FallbackBusMgOn, FallbackBusMgUnassignAllOf,
    useFallbackBusMgUnassignAllOfAll,
} from './bus/mg';
import { useFallbackBusesSorted } from './bus/sort';
import { useFallbackDcaColors, useFallbackDcaColor, FallbackDcaColor } from './dca/color';
import { useFallbackDcaHas } from './dca/has';
import { FallbackDcaIconUse, FallbackDcaIcon, useFallbackDcaIcon } from './dca/icon';
import {
    FallbackDcaLevel, FallbackDcaLevelPre, FallbackDcaMeterLevelPreHas, useFallbackDcaLevels,
} from './dca/level';
import { FallbackDcaMute } from './dca/mute';
import { useFallbackDcaNames, FallbackDcaName } from './dca/name';
import { useFallbackDcaOptions } from './dca/options';
import { FallbackDcaSolo } from './dca/solo';
import { useFallbackMgHas } from './mg/has';
import { FallbackMgIconUse, FallbackMgIcon, useFallbackMgIcon } from './mg/icon';
import { useFallbackMgNames, FallbackMgName } from './mg/name';
import { useFallbackMgOptions } from './mg/options';
import { FallbackMgMute } from './mg/mute';
import { FallbackIcon, Icon } from './shared/icon';


// Exported
export {
    FallbackProvider,
    useFallbackBusColors,
    useFallbackBusColor,
    useFallbackBusDca,
    FallbackBusDcaOn,
    FallbackBusDcaUnassignAllOf,
    useFallbackBusIcons,
    useFallbackBusIcon,
    FallbackBusIcon,
    useFallbackBusMg,
    FallbackBusMgOn,
    FallbackBusMgUnassignAllOf,
    useFallbackBusesSorted,
    useFallbackDcaColors,
    useFallbackDcaColor,
    FallbackDcaColor,
    useFallbackDcaHas,
    useFallbackBusDcaUnassignAllOfAll,
    FallbackDcaIconUse,
    FallbackDcaIcon,
    useFallbackDcaIcon,
    useFallbackDcaLevels,
    FallbackDcaLevel,
    FallbackDcaLevelPre,
    FallbackDcaMeterLevelPreHas,
    useFallbackDcaNames,
    FallbackDcaName,
    FallbackDcaMute,
    useFallbackDcaOptions,
    FallbackDcaSolo,
    FallbackIcon,
    Icon,
    useFallbackMgHas,
    useFallbackBusMgUnassignAllOfAll,
    FallbackMgIconUse,
    FallbackMgIcon,
    useFallbackMgIcon,
    useFallbackMgNames,
    FallbackMgName,
    useFallbackMgOptions,
    FallbackMgMute,
};
