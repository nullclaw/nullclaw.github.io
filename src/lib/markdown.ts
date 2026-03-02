import { marked, type Tokens } from 'marked';
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

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

const headingRenderer = {
    heading({ text, depth }: Tokens.Heading): string {
        const id = slugify(text.replace(/<[^>]*>/g, ''));
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
};

marked.use({ renderer: headingRenderer });

export function renderMarkdown(markdown: string) {
    const rawHtml = marked.parse(markdown) as string;
    return DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['id']
    });
}
