/// <reference types="vitest" />
import { join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginDoubleshot } from 'vite-plugin-doubleshot'
import DefineOptions from 'unplugin-vue-define-options/vite'
import UnoCSS from 'unocss/vite'
import EnvTypes from 'vite-plugin-env-types'

export default defineConfig({
	root: join(__dirname, 'src/render'),
	plugins: [
		vue(),
		/**
		 * 环境变量类型提示
		 * https://github.com/dishait/vite-plugin-env-types
		 */
		EnvTypes({
			dts: './src/render/presets/types/env.d.ts',
		}),
		UnoCSS(),
		DefineOptions(),
		VitePluginDoubleshot({
			type: 'electron',
			main: 'dist/main/index.js',
			entry: 'src/main/index.ts',
			outDir: 'dist/main',
			external: ['electron'],
			electron: {
				build: {
					config: './electron-builder.config.js',
					cliOptions: {
						publish: 'never', // "onTag" | "onTagOrDraft" | "always" | "never"
					},
				},
				preload: {
					entry: 'src/preload/index.ts',
					outDir: 'dist/preload',
				},
			},
		}),
	],
	resolve: {
		alias: {
			'@render': join(__dirname, 'src/render'),
			'@main': join(__dirname, 'src/main'),
			'@common': join(__dirname, 'src/common'),
		},
	},
	base: './',
	build: {
		outDir: join(__dirname, 'dist/render'),
		emptyOutDir: true,
	},
	test: { // e2e tests
		include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		testTimeout: 30_000,
		hookTimeout: 30_000,
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true
			},
		},
	},
})
