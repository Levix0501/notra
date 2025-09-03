import { toHtml } from 'hast-util-to-html';

import { CopyButton } from '@/components/copy-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from '@/i18n';

import { lowlight } from '../extensions/code-block/code-block-extension-base';

interface CodeBlockProps {
	language: string;
	text: string;
}

const t = getTranslations('notra_editor');

export const CodeBlock = ({ language, text }: CodeBlockProps) => {
	const tree = lowlight.listLanguages().includes(language)
		? lowlight.highlight(language, text)
		: lowlight.highlightAuto(text);
	const html = toHtml(tree);

	if (language === 'html') {
		return (
			<Tabs defaultValue="code">
				<TabsList>
					<TabsTrigger value="code">{t.code_block_code}</TabsTrigger>
					<TabsTrigger value="preview">{t.code_block_preview}</TabsTrigger>
				</TabsList>

				<TabsContent value="code">
					<div className="relative">
						<CopyButton className="absolute top-2 right-2" value={text} />

						<pre className="hljs !my-0 scrollbar-hide max-h-[500px] overflow-auto">
							<code dangerouslySetInnerHTML={{ __html: html }} />
						</pre>
					</div>
				</TabsContent>
				<TabsContent value="preview">
					<iframe className="h-[500px] w-full" srcDoc={text} />
				</TabsContent>
			</Tabs>
		);
	}

	return (
		<div className="relative">
			<CopyButton className="absolute top-2 right-2" value={text} />

			<pre className="hljs scrollbar-hide max-h-[500px] overflow-auto">
				<code dangerouslySetInnerHTML={{ __html: html }} />
			</pre>
		</div>
	);
};
