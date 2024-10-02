/**
 * Bundle app
 */

Bun.build({
	entrypoints: ['./src/index.ts'],
	outdir: './dist',
	target: 'browser',
	minify: true,
	sourcemap: 'external',
}).then(() => {
	console.log('Build complete');
})
