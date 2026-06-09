// Requirements
import BusSectionInstance from '../../../../pages/bus/view/sectionInstance';
import InputSectionInstance from '../../../../pages/input/view/sectionInstance';
import FxSectionInstance from '../../../../pages/fx/view/sectionInstance';
import DcaSectionInstance from '../../../../pages/dca/view/sectionInstance';
import MgSectionInstance from '../../../../pages/mg/view/sectionInstance';
import SceneSectionInstance from '../../../../pages/scene/view/sectionInstance';
import OutputSectionInstance from '../../../../pages/output/view/sectionInstance';
import VaultSectionInstance from '../../../../pages/vault/view/sectionInstance';


// Exported
export const hasHeaderTrailInstancePicker = (instance) => {
    if (!instance) return false;
    return instance.busId != null
        || instance.inputId != null
        || instance.fxId != null
        || instance.dcaId != null
        || instance.mgId != null
        || instance.sceneId != null
        || instance.outputId != null
        || instance.vaultId != null;
};


export default ({ instance }) => {
    const color = instance.color || 'gray';

    if (instance.busId != null) {
        return <BusSectionInstance busId={instance.busId} color={color} />;
    }
    if (instance.inputId != null) {
        return <InputSectionInstance inputId={instance.inputId} color={color} />;
    }
    if (instance.fxId != null) {
        return <FxSectionInstance fxId={instance.fxId} color={color} />;
    }
    if (instance.dcaId != null) {
        return <DcaSectionInstance dcaId={instance.dcaId} color={color} />;
    }
    if (instance.mgId != null) {
        return <MgSectionInstance mgId={instance.mgId} color={color} />;
    }
    if (instance.sceneId != null) {
        return <SceneSectionInstance sceneId={instance.sceneId} color={color} />;
    }
    if (instance.outputId != null) {
        return <OutputSectionInstance outputId={instance.outputId} color={color} />;
    }
    if (instance.vaultId != null) {
        return (
            <VaultSectionInstance
                vaultId={instance.vaultId}
                vaultType={instance.vaultType}
                color={color}
            />
        );
    }

    return null;
};
