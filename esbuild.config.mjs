import * as esbuild from 'esbuild'
import copyStaticFiles from 'esbuild-copy-static-files'

let ctx = await esbuild.context({
    entryPoints: ['src/Main.ts'],
    bundle: true,
    sourcemap: true,
    outdir: 'build',
    plugins: [copyStaticFiles({
        src: './static',
        dest: './build',
    })],
})

if (process.argv.includes('-w')) {
    await ctx.watch()
    console.log('Watching...')
    
    let { port } = await ctx.serve({servedir: 'build', host: 'localhost', port: 7000})
    console.log(`Serving http://localhost:${port}`)
} else {
    console.log('Building...')
    ctx.rebuild()
    ctx.dispose()
}
