import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

const t = getTranslations('notra_editor');

const languages = [
	{ label: t.language_select_auto, value: 'auto' },
	{ label: t.language_select_plaintext, value: 'plaintext' },
	{ label: 'ABAP', value: 'abap' },
	{ label: 'Agda', value: 'agda' },
	{ label: 'Arduino', value: 'arduino' },
	{ label: 'ASCII Art', value: 'ascii' },
	{ label: 'Assembly', value: 'x86asm' },
	{ label: 'Bash', value: 'bash' },
	{ label: 'BASIC', value: 'basic' },
	{ label: 'BNF', value: 'bnf' },
	{ label: 'C', value: 'c' },
	{ label: 'C#', value: 'csharp' },
	{ label: 'C++', value: 'cpp' },
	{ label: 'Clojure', value: 'clojure' },
	{ label: 'CoffeeScript', value: 'coffeescript' },
	{ label: 'Coq', value: 'coq' },
	{ label: 'CSS', value: 'css' },
	{ label: 'Dart', value: 'dart' },
	{ label: 'Dhall', value: 'dhall' },
	{ label: 'Diff', value: 'diff' },
	{ label: 'Docker', value: 'dockerfile' },
	{ label: 'EBNF', value: 'ebnf' },
	{ label: 'Elixir', value: 'elixir' },
	{ label: 'Elm', value: 'elm' },
	{ label: 'Erlang', value: 'erlang' },
	{ label: 'F#', value: 'fsharp' },
	{ label: 'Flow', value: 'flow' },
	{ label: 'Fortran', value: 'fortran' },
	{ label: 'Gherkin', value: 'gherkin' },
	{ label: 'GLSL', value: 'glsl' },
	{ label: 'Go', value: 'go' },
	{ label: 'GraphQL', value: 'graphql' },
	{ label: 'Groovy', value: 'groovy' },
	{ label: 'Haskell', value: 'haskell' },
	{ label: 'HCL', value: 'hcl' },
	{ label: 'HTML', value: 'html' },
	{ label: 'Idris', value: 'idris' },
	{ label: 'Java', value: 'java' },
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'JSON', value: 'json' },
	{ label: 'Julia', value: 'julia' },
	{ label: 'Kotlin', value: 'kotlin' },
	{ label: 'LaTeX', value: 'latex' },
	{ label: 'Less', value: 'less' },
	{ label: 'Lisp', value: 'lisp' },
	{ label: 'LiveScript', value: 'livescript' },
	{ label: 'LLVM IR', value: 'llvm' },
	{ label: 'Lua', value: 'lua' },
	{ label: 'Makefile', value: 'makefile' },
	{ label: 'Markdown', value: 'markdown' },
	{ label: 'Markup', value: 'markup' },
	{ label: 'MATLAB', value: 'matlab' },
	{ label: 'Mathematica', value: 'mathematica' },
	{ label: 'Mermaid', value: 'mermaid' },
	{ label: 'Nix', value: 'nix' },
	{ label: 'Notion Formula', value: 'notion' },
	{ label: 'Objective-C', value: 'objectivec' },
	{ label: 'OCaml', value: 'ocaml' },
	{ label: 'Pascal', value: 'pascal' },
	{ label: 'Perl', value: 'perl' },
	{ label: 'PHP', value: 'php' },
	{ label: 'PowerShell', value: 'powershell' },
	{ label: 'Prolog', value: 'prolog' },
	{ label: 'Protocol Buffers', value: 'protobuf' },
	{ label: 'PureScript', value: 'purescript' },
	{ label: 'Python', value: 'python' },
	{ label: 'R', value: 'r' },
	{ label: 'Racket', value: 'racket' },
	{ label: 'Reason', value: 'reasonml' },
	{ label: 'Ruby', value: 'ruby' },
	{ label: 'Rust', value: 'rust' },
	{ label: 'Sass', value: 'scss' },
	{ label: 'Scala', value: 'scala' },
	{ label: 'Scheme', value: 'scheme' },
	{ label: 'SCSS', value: 'scss' },
	{ label: 'Shell', value: 'shell' },
	{ label: 'Smalltalk', value: 'smalltalk' },
	{ label: 'Solidity', value: 'solidity' },
	{ label: 'SQL', value: 'sql' },
	{ label: 'Swift', value: 'swift' },
	{ label: 'TOML', value: 'toml' },
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'VB.Net', value: 'vbnet' },
	{ label: 'Verilog', value: 'verilog' },
	{ label: 'VHDL', value: 'vhdl' },
	{ label: 'Visual Basic', value: 'vbnet' },
	{ label: 'WebAssembly', value: 'wasm' },
	{ label: 'XML', value: 'xml' },
	{ label: 'YAML', value: 'yaml' }
];

interface LanguageSelectProps {
	language: string;
	onLanguageChange: (language: string) => void;
}

export const LanguageSelect = ({
	language,
	onLanguageChange
}: LanguageSelectProps) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(
		languages.find(({ value }) => value === language)?.value || 'auto'
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
				<Button
					aria-expanded={open}
					className="justify-between"
					role="combobox"
					size="sm"
					variant="ghost"
				>
					{value
						? languages.find((language) => language.value === value)?.label
						: t.language_select_placeholder}
					<ChevronDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[200px] p-0">
				<RemoveScroll>
					<Command>
						<CommandInput
							className="h-9"
							placeholder={t.language_select_search_placeholder}
						/>
						<CommandList>
							<CommandEmpty>{t.language_select_no_language_found}</CommandEmpty>
							<CommandGroup>
								{languages.map((language) => (
									<CommandItem
										key={language.label}
										value={language.value}
										onSelect={(currentValue) => {
											console.log(currentValue);
											setValue(currentValue === value ? '' : currentValue);
											setOpen(false);
											onLanguageChange(currentValue);
										}}
									>
										{language.label}
										<Check
											className={cn(
												'ml-auto',
												value === language.value ? 'opacity-100' : 'opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</RemoveScroll>
			</PopoverContent>
		</Popover>
	);
};
