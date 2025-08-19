'use client';

import {
	autoformatArrow,
	autoformatLegal,
	autoformatLegalHtml,
	autoformatMath,
	AutoformatPlugin,
	autoformatPunctuation,
	autoformatSmartQuotes
} from '@platejs/autoformat';
import { insertEmptyCodeBlock } from '@platejs/code-block';
import { toggleList } from '@platejs/list';
import { KEYS } from 'platejs';

import type { AutoformatRule } from '@platejs/autoformat';

const languageMap: Record<string, string> = {
	// Auto and Plain Text
	auto: 'auto',
	plaintext: 'plaintext',
	plain: 'plaintext',
	text: 'plaintext',
	txt: 'plaintext',

	// ABAP
	abap: 'abap',

	// Agda
	agda: 'agda',

	// Arduino
	arduino: 'arduino',

	// ASCII Art
	ascii: 'ascii',

	// Assembly
	assembly: 'x86asm',
	x86asm: 'x86asm',

	// Bash
	bash: 'bash',
	sh: 'bash',

	// BASIC
	basic: 'basic',

	// BNF
	bnf: 'bnf',

	// C
	c: 'c',

	// C#
	'c#': 'csharp',
	cs: 'csharp',
	csharp: 'csharp',

	// C++
	cpp: 'cpp',
	'c++': 'cpp',

	// Clojure
	clj: 'clojure',
	clojure: 'clojure',

	// CoffeeScript
	coffee: 'coffeescript',
	coffeescript: 'coffeescript',

	// Coq
	coq: 'coq',

	// CSS
	css: 'css',

	// Dart
	dart: 'dart',

	// Dhall
	dhall: 'dhall',

	// Diff
	diff: 'diff',

	// Docker
	dockerfile: 'dockerfile',
	docker: 'dockerfile',

	// EBNF
	ebnf: 'ebnf',

	// Elixir
	elixir: 'elixir',

	// Elm
	elm: 'elm',

	// Erlang
	erl: 'erlang',
	erlang: 'erlang',

	// F#
	'f#': 'fsharp',
	fsharp: 'fsharp',

	// Flow
	flow: 'flow',

	// Fortran
	fortran: 'fortran',

	// Gherkin
	gherkin: 'gherkin',

	// GLSL
	glsl: 'glsl',

	// Go
	go: 'go',

	// GraphQL
	graphql: 'graphql',

	// Groovy
	groovy: 'groovy',

	// Haskell
	hs: 'haskell',
	haskell: 'haskell',

	// HCL
	hcl: 'hcl',

	// HTML
	html: 'html',
	htm: 'html',

	// Idris
	idris: 'idris',

	// Java
	java: 'java',

	// JavaScript
	js: 'javascript',
	javascript: 'javascript',

	// JSON
	json: 'json',

	// Julia
	julia: 'julia',

	// Kotlin
	kt: 'kotlin',
	kotlin: 'kotlin',

	// LaTeX
	latex: 'latex',

	// Less
	less: 'less',

	// Lisp
	lisp: 'lisp',

	// LiveScript
	livescript: 'livescript',

	// LLVM IR
	llvm: 'llvm',

	// Lua
	lua: 'lua',

	// Makefile
	makefile: 'makefile',

	// Markdown
	md: 'markdown',
	markdown: 'markdown',

	// Markup
	markup: 'markup',

	// MATLAB
	matlab: 'matlab',

	// Mathematica
	mathematica: 'mathematica',

	// Mermaid
	mermaid: 'mermaid',

	// Nix
	nix: 'nix',

	// Notion Formula
	notion: 'notion',

	// Objective-C
	objectivec: 'objectivec',
	objc: 'objectivec',

	// OCaml
	ocaml: 'ocaml',
	ml: 'ocaml',

	// Pascal
	pascal: 'pascal',

	// Perl
	perl: 'perl',
	pl: 'perl',

	// PHP
	php: 'php',

	// PowerShell
	powershell: 'powershell',
	ps1: 'powershell',
	ps: 'powershell',

	// Prolog
	prolog: 'prolog',

	// Protocol Buffers
	protobuf: 'protobuf',

	// PureScript
	purescript: 'purescript',

	// Python
	py: 'python',
	python: 'python',

	// R
	r: 'r',

	// Racket
	racket: 'racket',

	// Reason
	reasonml: 'reasonml',
	reason: 'reasonml',

	// Ruby
	rb: 'ruby',
	ruby: 'ruby',

	// Rust
	rs: 'rust',
	rust: 'rust',

	// Sass
	scss: 'scss',
	sass: 'scss',

	// Scala
	scala: 'scala',

	// Scheme
	scheme: 'scheme',

	// Shell
	shell: 'shell',
	zsh: 'shell',
	fish: 'shell',
	env: 'shell',
	config: 'shell',
	conf: 'shell',
	log: 'shell',

	// Smalltalk
	smalltalk: 'smalltalk',

	// Solidity
	solidity: 'solidity',

	// SQL
	sql: 'sql',

	// Swift
	swift: 'swift',

	// TOML
	toml: 'toml',
	ini: 'toml',

	// TypeScript
	ts: 'typescript',
	typescript: 'typescript',

	// VB.Net
	vbnet: 'vbnet',
	vb: 'vbnet',

	// Verilog
	verilog: 'verilog',

	// VHDL
	vhdl: 'vhdl',

	// WebAssembly
	wasm: 'wasm',
	webassembly: 'wasm',

	// XML
	xml: 'xml',

	// YAML
	yaml: 'yaml',
	yml: 'yaml'
};

const autoformatMarks: AutoformatRule[] = [
	{
		match: '***',
		mode: 'mark',
		type: [KEYS.bold, KEYS.italic]
	},
	{
		match: '__*',
		mode: 'mark',
		type: [KEYS.underline, KEYS.italic]
	},
	{
		match: '__**',
		mode: 'mark',
		type: [KEYS.underline, KEYS.bold]
	},
	{
		match: '___***',
		mode: 'mark',
		type: [KEYS.underline, KEYS.bold, KEYS.italic]
	},
	{
		match: '**',
		mode: 'mark',
		type: KEYS.bold
	},
	{
		match: '__',
		mode: 'mark',
		type: KEYS.underline
	},
	{
		match: '*',
		mode: 'mark',
		type: KEYS.italic
	},
	{
		match: '_',
		mode: 'mark',
		type: KEYS.italic
	},
	{
		match: '~~',
		mode: 'mark',
		type: KEYS.strikethrough
	},
	{
		match: '^',
		mode: 'mark',
		type: KEYS.sup
	},
	{
		match: '~',
		mode: 'mark',
		type: KEYS.sub
	},
	{
		match: '==',
		mode: 'mark',
		type: KEYS.highlight
	},
	{
		match: '≡',
		mode: 'mark',
		type: KEYS.highlight
	},
	{
		match: '`',
		mode: 'mark',
		type: KEYS.code
	}
];

const autoformatBlocks: AutoformatRule[] = [
	{
		match: '# ',
		mode: 'block',
		type: KEYS.h1
	},
	{
		match: '## ',
		mode: 'block',
		type: KEYS.h2
	},
	{
		match: '### ',
		mode: 'block',
		type: KEYS.h3
	},
	{
		match: '#### ',
		mode: 'block',
		type: KEYS.h4
	},
	{
		match: '##### ',
		mode: 'block',
		type: KEYS.h5
	},
	{
		match: '###### ',
		mode: 'block',
		type: KEYS.h6
	},
	{
		match: '> ',
		mode: 'block',
		type: KEYS.blockquote
	},
	{
		match: [
			String.raw`^\`\`\` `,
			...Object.keys(languageMap).map((key) => String.raw`^\`\`\`${key}$`)
		],
		matchByRegex: true,
		mode: 'block',
		type: KEYS.codeBlock,
		format: (editor, { matchString }) => {
			const languageMatch = RegExp(/^```([^]*)$/).exec(matchString);

			if (languageMatch) {
				const language = languageMatch[1].toLowerCase();
				const mappedLanguage = languageMap[language] || 'plaintext';

				insertEmptyCodeBlock(editor, {
					defaultType: KEYS.p,
					insertNodesOptions: { select: true }
				});

				const codeBlockEntry = editor.api.above({
					match: { type: KEYS.codeBlock }
				});

				if (codeBlockEntry) {
					editor.tf.setNodes(
						{ lang: mappedLanguage },
						{ at: codeBlockEntry[1] }
					);
				}
			}
		}
	},

	// {
	// 	match: '```',
	// 	mode: 'block',
	// 	type: KEYS.codeBlock,
	// 	format: (editor) => {
	// 		insertEmptyCodeBlock(editor, {
	// 			defaultType: KEYS.p,
	// 			insertNodesOptions: { select: true }
	// 		});
	// 	}
	// },
	// {
	//   match: '+ ',
	//   mode: 'block',
	//   preFormat: openNextToggles,
	//   type: KEYS.toggle,
	// },
	{
		match: ['---', '—-', '___ '],
		mode: 'block',
		type: KEYS.hr,
		format: (editor) => {
			editor.tf.setNodes({ type: KEYS.hr });
			editor.tf.insertNodes({
				children: [{ text: '' }],
				type: KEYS.p
			});
		}
	}
];

const autoformatLists: AutoformatRule[] = [
	{
		match: ['* ', '- '],
		mode: 'block',
		type: 'list',
		format: (editor) => {
			toggleList(editor, {
				listStyleType: KEYS.ul
			});
		}
	},
	{
		match: [String.raw`^\d+\.$ `, String.raw`^\d+\)$ `],
		matchByRegex: true,
		mode: 'block',
		type: 'list',
		format: (editor, { matchString }) => {
			toggleList(editor, {
				listRestartPolite: Number(matchString) || 1,
				listStyleType: KEYS.ol
			});
		}
	},
	{
		match: ['[] '],
		mode: 'block',
		type: 'list',
		format: (editor) => {
			toggleList(editor, {
				listStyleType: KEYS.listTodo
			});
			editor.tf.setNodes({
				checked: false,
				listStyleType: KEYS.listTodo
			});
		}
	},
	{
		match: ['[x] '],
		mode: 'block',
		type: 'list',
		format: (editor) => {
			toggleList(editor, {
				listStyleType: KEYS.listTodo
			});
			editor.tf.setNodes({
				checked: true,
				listStyleType: KEYS.listTodo
			});
		}
	}
];

export const AutoformatKit = [
	AutoformatPlugin.configure({
		options: {
			enableUndoOnDelete: true,
			rules: [
				...autoformatBlocks,
				...autoformatMarks,
				...autoformatSmartQuotes,
				...autoformatPunctuation,
				...autoformatLegal,
				...autoformatLegalHtml,
				...autoformatArrow,
				...autoformatMath,
				...autoformatLists
			].map(
				(rule): AutoformatRule => ({
					...rule,
					query: (editor) =>
						!editor.api.some({
							match: { type: editor.getType(KEYS.codeBlock) }
						})
				})
			)
		}
	})
];
