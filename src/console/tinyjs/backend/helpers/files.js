// Variables
let dataDir = null;

const encoder = new TextEncoder();
const decoder = new TextDecoder();


// Exported
export const dataDirSet = (dir) => {
    dataDir = dir;
};


export const dataPath = (...parts) => [dataDir, ...parts].join('/');


export const exists = async (path) => {
    try {
        await tjs.stat(path);
        return true;
    } catch {
        return false;
    }
};


export const makeDir = path => tjs.makeDir(path, { recursive: true });


export const readText = async path => decoder.decode(await tjs.readFile(path));


export const writeText = (path, text) => tjs.writeFile(path, encoder.encode(text));


export const remove = path => tjs.remove(path);
