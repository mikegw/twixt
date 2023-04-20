import * as esbuild from 'esbuild';

import mri from 'mri';
import * as fs from "fs";

const prog = mri(process.argv.slice(2), {
    boolean: ['watch', 'minify', 'sourcemap', 'serve'],
    string: ['env']
});

const environment = prog.env || 'local'

const defaultConfig = JSON.parse(fs.readFileSync('config/default.json'))
const environmentConfig = JSON.parse(fs.readFileSync(`config/${environment}.json`))

const config  = { ...defaultConfig, ...environmentConfig }

const esbuildOptions = {
    entryPoints: ['src/index.ts'],
    define: { CONFIG: JSON.stringify(config) },
    bundle: true,
    platform: 'browser',
    outfile: 'public/index.js',
    minify: prog.minify,
    sourcemap: prog.sourcemap,
}

if (prog.watch) {
    let ctx = await esbuild.context(esbuildOptions)
    await ctx.watch()
} else if(prog.serve) {
    let ctx = await esbuild.context(esbuildOptions)
    await ctx.serve()
} else {
    await esbuild.build(esbuildOptions)
}

