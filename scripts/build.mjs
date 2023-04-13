import * as esbuild from 'esbuild';

import mri from 'mri';

const prog = mri(process.argv.slice(2), {
    boolean: ['watch', 'minify', 'sourcemap', 'serve'],
});

const esbuildOptions = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'browser',
    outfile: 'public/index.js',
    minify: prog.minify,
    sourcemap: prog.sourcemap,
}

let ctx = await esbuild.context(esbuildOptions)

if (prog.watch) {
    await ctx.watch()
} else {
    await ctx.serve()
}

