// https://docs.deuso.de/AUX/utils_biquad.js.html


// Constants
const Q_MAX = 0.7071;


// Internal
const lowShelf = (e) => {
    const { cos } = Math;
    const { sqrt } = Math;
    const A = 10 ** (e.gain / 40);
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const alpha = Math.sin(w0) / (2 * e.q);
    return {
        b0: A * (A + 1 - (A - 1) * cos(w0) + 2 * sqrt(A) * alpha),
        b1: 2 * A * (A - 1 - (A + 1) * cos(w0)),
        b2: A * (A + 1 - (A - 1) * cos(w0) - 2 * sqrt(A) * alpha),
        a0: A + 1 + (A - 1) * cos(w0) + 2 * sqrt(A) * alpha,
        a1: -2 * (A - 1 + (A + 1) * cos(w0)),
        a2: A + 1 + (A - 1) * cos(w0) - 2 * sqrt(A) * alpha,
        sampleRate: e.sampleRate,
    };
};


const lowShelfXAir = e => lowShelf({ ...e, q: Q_MAX });


const highShelf = (e) => {
    const { cos } = Math;
    const { sqrt } = Math;
    const A = 10 ** (e.gain / 40);
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const alpha = Math.sin(w0) / (2 * e.q);
    return {
        b0: A * (A + 1 + (A - 1) * cos(w0) + 2 * sqrt(A) * alpha),
        b1: -2 * A * (A - 1 + (A + 1) * cos(w0)),
        b2: A * (A + 1 + (A - 1) * cos(w0) - 2 * sqrt(A) * alpha),
        a0: A + 1 - (A - 1) * cos(w0) + 2 * sqrt(A) * alpha,
        a1: 2 * (A - 1 - (A + 1) * cos(w0)),
        a2: A + 1 - (A - 1) * cos(w0) - 2 * sqrt(A) * alpha,
        sampleRate: e.sampleRate,
    };
};


const highShelfXAir = e => highShelf({ ...e, q: Q_MAX });


const parametric = (e) => {
    const { cos } = Math;
    const A = 10 ** (e.gain / 40);
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const alpha = Math.sin(w0) / (2 * e.q);
    return {
        b0: 1 + alpha * A,
        b1: -2 * cos(w0),
        b2: 1 - alpha * A,
        a0: 1 + alpha / A,
        a1: -2 * cos(w0),
        a2: 1 - alpha / A,
        sampleRate: e.sampleRate,
    };
};


const parametricVintage = e => parametric({ ...e, q: e.q / 2.3 });


const notch = (e) => {
    const { cos } = Math;
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const alpha = Math.sin(w0) / (2 * e.q);
    return {
        b0: 1,
        b1: -2 * cos(w0),
        b2: 1,
        a0: 1 + alpha,
        a1: -2 * cos(w0),
        a2: 1 - alpha,
        sampleRate: e.sampleRate,
    };
};


const lowPass1 = (e) => {
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const s0 = Math.sin(w0);
    const c0 = Math.cos(w0);
    return {
        b0: 1 - c0,
        b1: 2 * (1 - c0),
        b2: 1 - c0,
        a0: 1 - c0 + s0,
        a1: 2 * (1 - c0),
        a2: 1 - c0 - s0,
        sampleRate: e.sampleRate,
    };
};


const lowPass2 = (e) => {
    const { cos } = Math;
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const alpha = Math.sin(w0) / (2 * e.q);
    return {
        b0: (1 - cos(w0)) / 2,
        b1: 1 - cos(w0),
        b2: (1 - cos(w0)) / 2,
        a0: 1 + alpha,
        a1: -2 * cos(w0),
        a2: 1 - alpha,
        sampleRate: e.sampleRate,
    };
};


const lowPass4 = (e) => {
    const O2 = lowPass2(e);
    O2.factor = 2;
    return O2;
};


const lowPassXAir = e => lowPass2({ ...e, q: Q_MAX });


const highPass1 = (e) => {
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const s0 = Math.sin(w0);
    const c0 = Math.cos(w0);
    return {
        b0: s0,
        b1: 0,
        b2: -s0,
        a0: 1 - c0 + s0,
        a1: 2 * (1 - c0),
        a2: 1 - c0 - s0,
        sampleRate: e.sampleRate,
    };
};


const highPass2 = (e) => {
    const { cos } = Math;
    const w0 = (2 * Math.PI * e.frequency) / e.sampleRate;
    const alpha = Math.sin(w0) / (2 * e.q);
    return {
        b0: (1 + cos(w0)) / 2,
        b1: -(1 + cos(w0)),
        b2: (1 + cos(w0)) / 2,
        a0: 1 + alpha,
        a1: -2 * cos(w0),
        a2: 1 - alpha,
        sampleRate: e.sampleRate,
    };
};


const highPass4 = (e) => {
    const O2 = highPass2(e);
    O2.factor = 2;
    return O2;
};


const highPassXAir = e => highPass2({ ...e, q: Q_MAX });


const buildModule = (e) => {
    const { log } = Math;
    const { sin } = Math;
    const LN10_10 = ((e.factor || 1.0) * 10) / Math.LN10;
    const PI = +(Math.PI / e.sampleRate);
    const Ra = +(((e.a0 + e.a1 + e.a2) * (e.a0 + e.a1 + e.a2)) / 4);
    const Rb = +(((e.b0 + e.b1 + e.b2) * (e.b0 + e.b1 + e.b2)) / 4);
    const Xa = +(4 * e.a0 * e.a2);
    const Ya = +(e.a1 * (e.a0 + e.a2));
    const Xb = +(4 * e.b0 * e.b2);
    const Yb = +(e.b1 * (e.b0 + e.b2));
    if (Ra === Rb && Ya === Yb && Xa === Xb) return () => 0;
    return (f) => {
        const f2 = +f;
        let S = +sin(PI * f2);
        S *= S;
        return (
            LN10_10
      * log((Rb - S * (Xb * (1 - S) + Yb)) / (Ra - S * (Xa * (1 - S) + Ya)))
        );
    };
};


const build1Filter = trafo => e => buildModule(trafo(e));


const buildNFilters = trafos => (e) => {
    const A = new Array(trafos.length);
    let i;
    for (i = 0; i < trafos.length; i += 1) {
        A[i] = buildModule(trafos[i](e));
    }
    return (f) => {
        let ret = 0.0;
        let j;
        for (j = 0; j < A.length; j += 1) {
            ret += A[j](f);
        }
        return ret;
    };
};


const build = (...args) => {
    if (args.length === 1) return build1Filter(args[0]);
    return buildNFilters.call(this, Array.prototype.slice.call(args));
};


const standardBiquadFilters = {
    lowShelf: build(lowShelf),
    lowShelfXAir: build(lowShelfXAir),
    highShelf: build(highShelf),
    highShelfXAir: build(highShelfXAir),
    parametric: build(parametric),
    parametricVintage: build(parametricVintage),
    notch: build(notch),
    lowPass1: build(lowPass1),
    lowPass2: build(lowPass2),
    lowPass3: build(lowPass1, lowPass2),
    lowPass4: build(lowPass4),
    lowPassXAir: build(lowPassXAir),
    highPass1: build(highPass1),
    highPass2: build(highPass2),
    highPass3: build(highPass1, highPass2),
    highPass4: build(highPass4),
    highPassXAir: build(highPassXAir),
};


// Exported
export const biquadFilterGet = (e) => {
    if (!standardBiquadFilters[e.type]) return () => 0;
    return standardBiquadFilters[e.type](e);
};


export const noQNeeded = type => [
    'lowPass1', 'lowPass2', 'lowPass3', 'lowPass4', 'lowPassXAir',
    'highPass1', 'highPass2', 'highPass3', 'highPass4', 'highPassXAir',
].includes(type);


export const gainAlwaysZero = noQNeeded;
