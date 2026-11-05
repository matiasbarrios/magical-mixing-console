import path from 'path';
import { fileURLToPath } from 'url';
import { guiConfig } from './gui.mjs';


const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export default guiConfig({
    outDir: path.join(repoRoot, 'out/tinyjs/www'),
    port: 3002,
});
