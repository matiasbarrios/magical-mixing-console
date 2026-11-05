// Webpack's ProvidePlugin used to inject these. Dependencies still expect them.
import { Buffer } from 'buffer';
import process from 'process/browser.js';


window.Buffer = Buffer;
window.process = window.process || process;
