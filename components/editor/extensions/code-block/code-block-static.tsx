interface CodeBlockStaticProps {
	html: string;
}

export const CodeBlockStatic = ({ html }: CodeBlockStaticProps) => {
	return (
		<pre className="hljs">
			<code dangerouslySetInnerHTML={{ __html: html }} />
		</pre>
	);
};
