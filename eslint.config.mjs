import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import jsonc from 'eslint-plugin-jsonc';
import tailwind from 'eslint-plugin-tailwindcss';

/**
 * Recursively walks `dir`, looking for the first .css file
 * that has a line starting with @import "tailwindcss
 * @param {string} dir  absolute path to start searching from
 * @returns {string|null}  absolute path to matching CSS, or null if none found
 *
 * @example
 * const twCssPath = findTailwindImportCss(process.cwd())
 */
function findTailwindImportCss(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			const found = findTailwindImportCss(fullPath);

			if (found) return found;
		} else if (entry.isFile() && entry.name.endsWith('.css')) {
			// read & scan lines
			const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);

			for (let line of lines) {
				if (line.trim().startsWith("@import 'tailwindcss")) {
					return fullPath;
				}
			}
		}
	}

	return null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = defineConfig([
	{
		files: ['**/*.{js,jsx,ts,tsx,mjs}'],
		plugins: {
			'@next/next': nextPlugin
		},
		rules: {
			...nextPlugin.configs.recommended.rules
		}
	},
	...nextTs,
	prettier,
	// JSON/JSONC configuration
	...jsonc.configs['flat/recommended-with-json'],
	{
		files: ['**/package.json'],
		rules: {
			'jsonc/sort-array-values': [
				'error',
				{
					order: { type: 'asc' },
					pathPattern: '^files$'
				}
			],
			'jsonc/sort-keys': [
				'error',
				{
					order: [
						'publisher',
						'name',
						'displayName',
						'type',
						'version',
						'private',
						'packageManager',
						'description',
						'author',
						'contributors',
						'license',
						'funding',
						'homepage',
						'repository',
						'bugs',
						'keywords',
						'categories',
						'sideEffects',
						'imports',
						'exports',
						'main',
						'module',
						'unpkg',
						'jsdelivr',
						'types',
						'typesVersions',
						'bin',
						'icon',
						'files',
						'engines',
						'activationEvents',
						'contributes',
						'scripts',
						'peerDependencies',
						'peerDependenciesMeta',
						'dependencies',
						'optionalDependencies',
						'devDependencies',
						'pnpm',
						'overrides',
						'resolutions',
						'husky',
						'simple-git-hooks',
						'lint-staged',
						'eslintConfig'
					],
					pathPattern: '^$'
				},
				{
					order: { type: 'asc' },
					pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$'
				},
				{
					order: ['types', 'import', 'require', 'default'],
					pathPattern: '^exports.*$'
				},
				{
					order: [
						'pre-commit',
						'prepare-commit-msg',
						'commit-msg',
						'post-commit',
						'pre-rebase',
						'post-rewrite',
						'post-checkout',
						'post-merge',
						'pre-push',
						'pre-auto-gc'
					],
					pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$'
				}
			]
		}
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts'
	]),
	...compat.extends('plugin:import/recommended', 'plugin:import/typescript'),
	...compat.plugins('import', 'react'),
	...tailwind.configs['flat/recommended'],
	{
		settings: {
			tailwindcss: {
				config: findTailwindImportCss(process.cwd()),
				callees: ['cn', 'cva']
			}
		}
	},
	{
		rules: {
			'tailwindcss/no-custom-classname': [
				'warn',
				{
					whitelist: ['notra-editor', 'hljs']
				}
			]
		}
	},
	{
		rules: {
			'react/jsx-sort-props': [
				'warn',
				{
					callbacksLast: true,
					shorthandFirst: true,
					noSortAlphabetically: false,
					reservedFirst: true
				}
			],
			'import/order': [
				'error',
				{
					pathGroups: [
						{
							pattern: '@/**',
							group: 'internal',
							position: 'before'
						}
					],
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling'],
						'index',
						'object',
						'type'
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			]
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true
				}
			}
		}
	},
	{
		rules: {
			'padding-line-between-statements': [
				'error',
				// 1. Always add a blank line after import statements
				{ blankLine: 'always', prev: 'import', next: '*' },
				{ blankLine: 'any', prev: 'import', next: 'import' },

				// 2. Always add a blank line after variable declarations (const/let/var)
				{ blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
				{
					blankLine: 'any',
					prev: ['const', 'let', 'var'],
					next: ['const', 'let', 'var']
				},

				// 3. Always add a blank line before and after control flow statements (if/for/while/switch/try)
				{
					blankLine: 'always',
					prev: '*',
					next: ['if', 'for', 'while', 'switch', 'try']
				},
				{
					blankLine: 'always',
					prev: ['if', 'for', 'while', 'switch', 'try'],
					next: '*'
				},

				// 4. Always add a blank line before return and throw statements
				{ blankLine: 'always', prev: '*', next: ['return', 'throw'] },

				// 5. Always add a blank line before and after function and class declarations
				{ blankLine: 'always', prev: '*', next: ['function', 'class'] },
				{ blankLine: 'always', prev: ['function', 'class'], next: '*' },

				// 6. Always add a blank line before and after block-like statements (e.g., blocks, functions, classes)
				{ blankLine: 'always', prev: '*', next: 'block-like' },
				{ blankLine: 'always', prev: 'block-like', next: '*' }
			]
		}
	}
]);

export default eslintConfig;
