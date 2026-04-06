import DOMPurify from 'isomorphic-dompurify'

const purifyConfig = {
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'ul',
    'ol',
    'li',
    'a',
    'strong',
    'em',
    'del',
    'code',
    'pre',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'blockquote',
    'sup',
    'sub',
    'mark',
    'dl',
    'dt',
    'dd',
    'input',
    'span',
    'section',
    'div'
  ],
  ALLOWED_ATTR: [
    'href',
    'target',
    'rel',
    'class',
    'id',
    'type',
    'checked',
    'disabled',
    'start',
    'value'
  ],
  ALLOW_DATA_ATTR: false
}

export function sanitizeHtml(html: string): string {
  return String(DOMPurify.sanitize(html, purifyConfig))
}
