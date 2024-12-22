/**
 * Currently I am behind a VPN and we do not have a tsup bundler in our npm registry
 *
 * Caution: This script tries to emulate tsup bundler configurations and it might be removed in future
 */

import * as esbuild from 'esbuild';
import { parseArgs } from 'node:util';

const args = process.argv.slice(2);
// command line options
const options = {
    minify: {
        type: 'string',
        short: 'm'
    },
    format: {
        type: 'string',
        short: 'f'
    },
    globalName: {
        type: 'string',
        short: 'g'
    }
};

const {
    values: { format, minify, globalName }
} = parseArgs({ args, options });
const formats = format == null ? ['cjs'] : format.split(',');
const namespace = globalName || 'lib.api';

console.log(`API exposed using the following namespace in browser: ${namespace}\r\n`);

for (let index = 0; index < formats.length; index++) {
    const format = formats[index];
    const outExtensionValue = format === 'esm' ? '.mjs' : format === 'iife' ? '.global.js' : '.js';
    console.log(`Building format: ${format}`);

    await esbuild.build({
        entryPoints: ['./src/index.ts'],
        format,
        bundle: true,
        minify: !!minify,
        splitting: false,
        sourcemap: true,
        outdir: './dist',
        outExtension: { '.js': outExtensionValue },
        globalName: namespace
    });
}
