// Requirements
import { captureValues, captureValue } from './values.js';


// Exported
export const busCapture = async (device) => {
    const { bus, dca, mg } = device.features;
    const busIds = bus.options.map(o => o.id);

    await captureValues('Bus names', bus.name, busIds);
    await captureValues('Bus colors', bus.color, busIds);
    await captureValues('Bus icons', bus.icon, busIds);
    await captureValues('Bus disabled', bus.disabled, busIds);
    await captureValues('Bus mute', bus.mute, busIds);
    await captureValues('Bus level', bus.level, busIds);
    await captureValues('Bus pan', bus.pan, busIds);
    await captureValues('Bus polarity', bus.polarity, busIds);
    await captureValues('Bus stereo link', bus.stereoLink, busIds);

    await captureValues('Bus low cut', bus.lowCut, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.lowCut.on);
            await captureValue(busId, bus.lowCut.frequency);
        },
    });

    await captureValues('Bus input', bus.input, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.input.id, {
                onGotten: async (inputId) => {
                    if (inputId === undefined || inputId === null) return;
                    await captureValue(inputId, bus.input.trim, {
                        parentId: busId,
                    });
                },
            });
            await captureValue(busId, bus.input.volume);
        },
    });

    await captureValues('Bus equalizer', bus.equalizer, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.equalizer.on);
            await captureValue(busId, bus.equalizer.mode);
            await captureValue(busId, bus.equalizer.parametric, {
                onHas: async () => {
                    const eqParameters = bus.equalizer.parametric.options(busId).map(o => o.id);
                    await captureValues('', bus.equalizer.parametric.on, eqParameters, { parentId: busId });
                    await captureValues('', bus.equalizer.parametric.type, eqParameters, { parentId: busId });
                    await captureValues('', bus.equalizer.parametric.frequency, eqParameters, { parentId: busId });
                    await captureValues('', bus.equalizer.parametric.q, eqParameters, { parentId: busId });
                    await captureValues('', bus.equalizer.parametric.gain, eqParameters, { parentId: busId });
                },
            });
            await captureValue(busId, bus.equalizer.graphic, {
                onHas: async () => {
                    const eqParameters = bus.equalizer.graphic.options(busId).map(o => o.id);
                    await captureValues('', bus.equalizer.graphic.gain, eqParameters, { parentId: busId });
                },
            });
            await captureValue(busId, bus.equalizer.true, {
                onHas: async () => {
                    const eqParameters = bus.equalizer.true.options(busId).map(o => o.id);
                    await captureValues('', bus.equalizer.true.gain, eqParameters, { parentId: busId });
                },
            });
        },
    });

    await captureValues('Bus compressor', bus.compressor, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.compressor.on);
            await captureValue(busId, bus.compressor.mode);
            await captureValue(busId, bus.compressor.knee);
            await captureValue(busId, bus.compressor.threshold);
            await captureValue(busId, bus.compressor.ratio);
            await captureValue(busId, bus.compressor.mix);
            await captureValue(busId, bus.compressor.gain);
            await captureValue(busId, bus.compressor.envelope);
            await captureValue(busId, bus.compressor.determination);
            await captureValue(busId, bus.compressor.automatic);
            await captureValue(busId, bus.compressor.attack);
            await captureValue(busId, bus.compressor.hold);
            await captureValue(busId, bus.compressor.release);
            await captureValue(busId, bus.compressor.sidechain, {
                onHas: async () => {
                    await captureValue(busId, bus.compressor.sidechain.on);
                    await captureValue(busId, bus.compressor.sidechain.source);
                    await captureValue(busId, bus.compressor.sidechain.type);
                    await captureValue(busId, bus.compressor.sidechain.frequency);
                },
            });
        },
    });

    await captureValues('Bus gate', bus.gate, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.gate.on);
            await captureValue(busId, bus.gate.mode);
            await captureValue(busId, bus.gate.threshold);
            await captureValue(busId, bus.gate.range);
            await captureValue(busId, bus.gate.attack);
            await captureValue(busId, bus.gate.hold);
            await captureValue(busId, bus.gate.release);
            await captureValue(busId, bus.gate.sidechain, {
                onHas: async () => {
                    await captureValue(busId, bus.gate.sidechain.on);
                    await captureValue(busId, bus.gate.sidechain.source);
                    await captureValue(busId, bus.gate.sidechain.type);
                    await captureValue(busId, bus.gate.sidechain.frequency);
                },
            });
        },
    });

    await captureValues('Bus fx', bus.fx, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.fx.id);
            await captureValue(busId, bus.fx.on);
            await captureValue(busId, bus.fx.gain);
        },
    });

    await captureValues('Bus insert', bus.insert, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.insert.on);
            await captureValue(busId, bus.insert.fx);
        },
    });

    await captureValues('Bus monitor', bus.monitor, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.monitor.mono);
            await captureValue(busId, bus.monitor.channelLineEffectTap);
            await captureValue(busId, bus.monitor.secondaryTap);
            await captureValue(busId, bus.monitor.source, {
                onHas: async () => {
                    await captureValue(busId, bus.monitor.source.id);
                    await captureValue(busId, bus.monitor.source.trim);
                },
            });
            await captureValue(busId, bus.monitor.dim, {
                onHas: async () => {
                    await captureValue(busId, bus.monitor.dim.on);
                    await captureValue(busId, bus.monitor.dim.attenuation);
                    await captureValue(busId, bus.monitor.dim.atPreLevel);
                },
            });
        },
    });

    await captureValues('Bus automix', bus.automix, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.automix.id);
            await captureValue(busId, bus.automix.weight);
            await captureValue(busId, bus.automix.gainReduction);
        },
    });

    await captureValues('Bus DCA', bus.dca, busIds, {
        onHas: async (busId) => {
            const dcaIds = dca.options.map(o => o.id);
            await captureValues('', bus.dca.on, dcaIds, { parentId: busId });
        },
    });

    await captureValues('Bus mute group', bus.mg, busIds, {
        onHas: async (busId) => {
            const mgIds = mg.options.map(o => o.id);
            await captureValues('', bus.mg.on, mgIds, { parentId: busId });
        },
    });

    await captureValues('Bus to', bus.to, busIds, {
        onHas: async (busId) => {
            const toIds = bus.to.options(busId).map(o => o.id);
            await captureValues('', bus.to.on, toIds, { parentId: busId });
            await captureValues('', bus.to.level, toIds, { parentId: busId });
            await captureValues('', bus.to.pan, toIds, { parentId: busId });
            await captureValues('', bus.to.tap, toIds, { parentId: busId });
        },
    });

    await captureValues('Bus rta position', bus.rta, busIds, {
        onHas: async (busId) => {
            await captureValue(busId, bus.rta.position);
        },
    });

    await captureValues('Bus rta value', bus.rta, busIds);
};
