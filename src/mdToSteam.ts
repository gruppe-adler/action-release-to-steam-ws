import marked from 'marked';

const renderer = new marked.Renderer();

/**
 * @param {string} code Actual code
 * @param {string} language String at end of opening back ticks (usually to select syntax highlighting)
 * @param {boolean} isEscaped ?
 */
renderer.code = (code: string, language: string, isEscaped: boolean): string => {
    return `[code]\n${code}\n[/code]`;
};

/**
 * @param {string} quote Quote text
 */
renderer.blockquote = (quote: string): string => {
    return `[quote=]${quote}[/quote]`;
};

/**
 * @param {string} html
 */
renderer.html = (html): string => {
    return html;
};

renderer.hr = (): string => {
    return '[hr][/hr]';
};

/**
 * @param {string} body List body (already rendered)
 * @param {boolean} ordered If list is ordered or unordered
 * @param {number} start Number with which ordered list starts
 */
renderer.list = (body: string, ordered: boolean, start: number): string => {
    const tag = ordered ? 'olist' : 'list';

    return `[${tag}]\n${body}[/${tag}]\n`;
};

/**
 * @param {string} text List item text
 */
renderer.listitem = (text: string): string => {
    return `[*]${text}\n`;
};

/**
 * @param {boolean} checked Checkbox checked
 */
renderer.checkbox = (checked: boolean): string => {
    return checked ? '🗹' : '☐';
};

/**
 * @param {string} text Text
 */
renderer.paragraph = (text: string): string => {
    return `${text}\n`;
};

/**
 * @param {string} header Header row (already rendered)
 * @param {string} body Body rows (already rendered)
 */
renderer.table = (header: string, body: string): string => {
    return `[table]\n${header}${body}[/table]`;
};

/**
 * @param {string} content Table cells (already rendered)
 */
renderer.tablerow = (content: string): string => {
    return `[tr]\n${content}[/tr]\n`;
};

/**
 * @param {string} text Text (already rendered)
 * @param {number} level Heading level
 * @param {string} raw Raw (not rendered) text
 * @param {slugger} slugger Slugger
 */
renderer.heading = (text: string, level: number, raw: string, slugger: marked.Slugger): string => {
    // steam only allows h1, h2 and h3
    if (level > 4) return `${text}\n`;
    if (level === 4) return `[b]${text}[/b]\n`;

    return `[h${level}]${text}[/h${level}]\n`;
};

/**
 * @param {string} content Cell content
 * @param {object} flags
 * @param {boolean} flags.header Is header cell
 * @param {null|'left'|'right'|'center'} flags.align Cell alignment
 */
renderer.tablecell = (content: string, { header }: { header: boolean, align: null|'left'|'right'|'center' }): string => {
    const tag = header ? 'th' : 'td';
    return `[${tag}]${content}[/${tag}]\n`;
};

/**
 * @param {string} text
 */
renderer.strong = (text: string): string => {
    return `[b]${text}[/b]`;
};

/**
 * @param {string} text
 */
renderer.em = (text: string): string => {
    return `[i]${text}[/i]`;
};

/**
 * @param {string} code
 */
renderer.codespan = (code: string): string => {
    return code;
};

renderer.br = (): string => {
    return '\n';
};

/**
 * @param {string} text
 */
renderer.del = (text: string): string => {
    return `[strike]${text}[/strike]`;
};

/**
 * @param {string} href
 * @param {string} title
 * @param {string} text
 */
renderer.link = (href: string, title: string, text: string): string => {
    return `[url=${href}]${text}[/url]`;
};

/**
 * @param {string} href
 * @param {string} title
 * @param {string} text
 */
renderer.image = (href: string): string => {
    return `[img]${href}[/img]`;
};

/**
 * @param {string} text
 */
renderer.text = (text: string): string => {
    return text;
};

/**
 * Convert markdown to steam's markup
 * @param md Markdown
 * @returns Text in steam markup
 */
export function mdToSteam(md: string): string {
    return marked(md, { renderer });
}
