import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
	base: process.env.VITE_BASE || '/',
	plugins: [
		react(),
		tailwindcss(),
		ViteImageOptimizer({
			jpg: {
				quality: 72,
				mozjpeg: true,
			},
			jpeg: {
				quality: 72,
				mozjpeg: true,
			},
			png: {
				quality: 72,
			},
			webp: {
				quality: 72,
			},
			svg: {
				multipass: true,
			},
		}),
	],
	build: {
		target: 'es2022',
		cssMinify: true,
		minify: 'oxc',
		sourcemap: false,
		assetsInlineLimit: 2048,
		reportCompressedSize: true,
		chunkSizeWarningLimit: 600,
		rolldownOptions: {
			output: {
				minify: {
					compress: {
						dropConsole: true,
						dropDebugger: true,
					},
				},
				codeSplitting: {
					groups: [
						{
							name: 'react',
							test: /node_modules[\\/](react|react-dom)([\\/]|$)/,
						},
						{
							name: 'fluid',
							test: /node_modules[\\/]fluid-canvas([\\/]|$)/,
						},
						{
							name: 'icons',
							test: /node_modules[\\/]@fortawesome([\\/]|$)/,
						},
					],
				},
			},
		},
	},
	server: {
		port: 8080,
	},
});
