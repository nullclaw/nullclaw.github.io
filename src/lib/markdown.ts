import { marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import DOMPurify from 'isomorphic-dompurify';
import hljs from 'highlight.js';

marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
}));

export function renderMarkdown(markdown: string) {
    const rawHtml = marked.parse(markdown) as string;
    return DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
}
