// App-scene capture paths intentionally exclude:
// - configuration.* (desk config; use configuration.reset() instead)
// - Meters and read-only values (rta, gainReduction, key, output.volume, bus.input.volume, …)
// - bus.disabled (derived / not a persisted parameter)
// load() accepts the same prefix families listed below.


// Internal
const scheduleAutomixPaths = ({ enqueuePath }, automix) => {
    automix.options.forEach(({ id }) => {
        enqueuePath(`automix.on(${id})`);
        enqueuePath(`automix.lock(${id})`);
    });
};


const scheduleBusCompressorPaths = (enqueuePath, busId) => {
    enqueuePath(`bus.compressor(${busId}).on`);
    enqueuePath(`bus.compressor(${busId}).mode`);
    enqueuePath(`bus.compressor(${busId}).knee`);
    enqueuePath(`bus.compressor(${busId}).threshold`);
    enqueuePath(`bus.compressor(${busId}).ratio`);
    enqueuePath(`bus.compressor(${busId}).mix`);
    enqueuePath(`bus.compressor(${busId}).gain`);
    enqueuePath(`bus.compressor(${busId}).envelope`);
    enqueuePath(`bus.compressor(${busId}).determination`);
    enqueuePath(`bus.compressor(${busId}).automatic`);
    enqueuePath(`bus.compressor(${busId}).attack`);
    enqueuePath(`bus.compressor(${busId}).hold`);
    enqueuePath(`bus.compressor(${busId}).release`);
    enqueuePath(`bus.compressor(${busId}).sidechain.on`);
    enqueuePath(`bus.compressor(${busId}).sidechain.source`);
    enqueuePath(`bus.compressor(${busId}).sidechain.type`);
    enqueuePath(`bus.compressor(${busId}).sidechain.frequency`);
};


const scheduleBusGatePaths = (enqueuePath, busId) => {
    enqueuePath(`bus.gate(${busId}).on`);
    enqueuePath(`bus.gate(${busId}).mode`);
    enqueuePath(`bus.gate(${busId}).threshold`);
    enqueuePath(`bus.gate(${busId}).range`);
    enqueuePath(`bus.gate(${busId}).attack`);
    enqueuePath(`bus.gate(${busId}).hold`);
    enqueuePath(`bus.gate(${busId}).release`);
    enqueuePath(`bus.gate(${busId}).sidechain.on`);
    enqueuePath(`bus.gate(${busId}).sidechain.source`);
    enqueuePath(`bus.gate(${busId}).sidechain.type`);
    enqueuePath(`bus.gate(${busId}).sidechain.frequency`);
};


const scheduleBusMonitorPaths = (enqueuePath, busId) => {
    enqueuePath(`bus.monitor(${busId}).mono`);
    enqueuePath(`bus.monitor(${busId}).channelLineEffectTap`);
    enqueuePath(`bus.monitor(${busId}).secondaryTap`);
    enqueuePath(`bus.monitor(${busId}).source.id`);
    enqueuePath(`bus.monitor(${busId}).source.trim`);
    enqueuePath(`bus.monitor(${busId}).dim.on`);
    enqueuePath(`bus.monitor(${busId}).dim.attenuation`);
    enqueuePath(`bus.monitor(${busId}).dim.atPreLevel`);
};


const scheduleBusPaths = (ctx, bus) => {
    const { enqueuePath, discover, discoverOnce } = ctx;

    bus.options.forEach(({ id }) => {
        enqueuePath(`bus.automix(${id}).id`);
        enqueuePath(`bus.automix(${id}).weight`);

        enqueuePath(`bus.color(${id})`);

        scheduleBusCompressorPaths(enqueuePath, id);

        discover(bus.dca, [id], () => {
            bus.dca.options(id).forEach(({ id: dcaId }) => {
                enqueuePath(`bus.dca(${id}).on(${dcaId})`);
            });
        });

        enqueuePath(`bus.equalizer(${id}).on`);
        enqueuePath(`bus.equalizer(${id}).mode`);
        discover(bus.equalizer.parametric, [id], () => {
            bus.equalizer.parametric.options(id).forEach(({ id: parameterId }) => {
                enqueuePath(`bus.equalizer(${id}).parametric.on(${parameterId})`);
                enqueuePath(`bus.equalizer(${id}).parametric.type(${parameterId})`);
                enqueuePath(`bus.equalizer(${id}).parametric.frequency(${parameterId})`);
                enqueuePath(`bus.equalizer(${id}).parametric.q(${parameterId})`);
                enqueuePath(`bus.equalizer(${id}).parametric.gain(${parameterId})`);
            });
        });
        discover(bus.equalizer.graphic, [id], () => {
            bus.equalizer.graphic.options(id).forEach(({ id: graphicId }) => {
                enqueuePath(`bus.equalizer(${id}).graphic.gain(${graphicId})`);
            });
        });
        discover(bus.equalizer.true, [id], () => {
            bus.equalizer.true.options(id).forEach(({ id: trueId }) => {
                enqueuePath(`bus.equalizer(${id}).true.gain(${trueId})`);
            });
        });

        enqueuePath(`bus.fx(${id}).id`);
        enqueuePath(`bus.fx(${id}).on`);
        enqueuePath(`bus.fx(${id}).gain`);

        scheduleBusGatePaths(enqueuePath, id);

        enqueuePath(`bus.icon(${id})`);

        enqueuePath(`bus.input(${id}).id`);
        discoverOnce(bus.input.id, [id], (inputId) => {
            if (inputId === null) return;
            enqueuePath(`bus.input(${id}).trim(${inputId})`);
        });

        enqueuePath(`bus.insert(${id}).on`);
        enqueuePath(`bus.insert(${id}).fx`);

        enqueuePath(`bus.level(${id})`);

        enqueuePath(`bus.lowCut(${id}).on`);
        enqueuePath(`bus.lowCut(${id}).frequency`);

        discover(bus.mg, [id], () => {
            bus.mg.options(id).forEach(({ id: mgId }) => {
                enqueuePath(`bus.mg(${id}).on(${mgId})`);
            });
        });

        scheduleBusMonitorPaths(enqueuePath, id);

        enqueuePath(`bus.mute(${id})`);

        enqueuePath(`bus.name(${id})`);

        enqueuePath(`bus.pan(${id})`);

        enqueuePath(`bus.polarity(${id})`);

        enqueuePath(`bus.stereoLink(${id})`);

        bus.options.forEach(({ id: busToId }) => {
            enqueuePath(`bus.to(${id}).on(${busToId})`);
            enqueuePath(`bus.to(${id}).level(${busToId})`);
            enqueuePath(`bus.to(${id}).pan(${busToId})`);
            enqueuePath(`bus.to(${id}).tap(${busToId})`);
        });
    });
};


const scheduleDcaPaths = ({ enqueuePath }, dca) => {
    dca.options.forEach(({ id }) => {
        enqueuePath(`dca.color(${id})`);
        enqueuePath(`dca.icon(${id})`);
        enqueuePath(`dca.level(${id})`);
        enqueuePath(`dca.mute(${id})`);
        enqueuePath(`dca.name(${id})`);
        enqueuePath(`dca.solo(${id})`);
    });
};


const scheduleFxPaths = (ctx, fx) => {
    const { enqueuePath, discover, discoverOnce } = ctx;

    fx.options.forEach(({ id }) => {
        enqueuePath(`fx.insert(${id}).on`);
        enqueuePath(`fx.insert(${id}).left`);
        enqueuePath(`fx.insert(${id}).right`);
        enqueuePath(`fx.bus(${id})`);
        discoverOnce(fx.type, [id], (typeId) => {
            enqueuePath(`fx.type(${id})`);
            discover(fx.parameters, [id, typeId], () => {
                fx.parameters.options(id, typeId).forEach(({ id: parameterId }) => {
                    enqueuePath(`fx.parameters(${id}, ${typeId}).parameter(${parameterId})`);
                });
            });
        });
    });
};


const scheduleInputPaths = ({ enqueuePath }, input) => {
    input.options.forEach(({ id }) => {
        enqueuePath(`input.name(${id})`);
        enqueuePath(`input.gain(${id})`);
        enqueuePath(`input.phantom(${id})`);
    });
};


const scheduleMgPaths = ({ enqueuePath }, mg) => {
    mg.options.forEach(({ id }) => {
        enqueuePath(`mg.icon(${id})`);
        enqueuePath(`mg.mute(${id})`);
        enqueuePath(`mg.name(${id})`);
    });
};


const scheduleOutputPaths = ({ enqueuePath }, output) => {
    output.options.forEach(({ id }) => {
        enqueuePath(`output.name(${id})`);
        enqueuePath(`output.source(${id})`);
        enqueuePath(`output.tap(${id})`);
    });
};


// Exported
export const APP_SCENE_PATH_PREFIXES = [
    'automix.',
    'bus.',
    'dca.',
    'fx.',
    'input.',
    'mg.',
    'output.',
];


export const runAppSceneCaptureDiscovery = (ctx, features) => {
    const {
        automix, bus, dca, fx, input, mg, output,
    } = features;

    ctx.discover(automix, [], () => {
        scheduleAutomixPaths(ctx, automix);
    });

    ctx.discover(bus, [], () => {
        scheduleBusPaths(ctx, bus);
    });

    ctx.discover(dca, [], () => {
        scheduleDcaPaths(ctx, dca);
    });

    ctx.discover(fx, [], () => {
        scheduleFxPaths(ctx, fx);
    });

    ctx.discover(input, [], () => {
        scheduleInputPaths(ctx, input);
    });

    ctx.discover(mg, [], () => {
        scheduleMgPaths(ctx, mg);
    });

    ctx.discover(output, [], () => {
        scheduleOutputPaths(ctx, output);
    });
};
