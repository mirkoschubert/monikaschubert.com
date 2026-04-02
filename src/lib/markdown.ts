import { Marked } from 'marked'
import markedFootnote from 'marked-footnote'

const marked = new Marked()

marked.use({ gfm: true })
marked.use(markedFootnote())

// Extended syntax via custom tokenizer + renderer
marked.use({
	extensions: [
		// ==highlight==
		{
			name: 'highlight',
			level: 'inline',
			start(src: string) { return src.indexOf('==') },
			tokenizer(src: string) {
				const match = src.match(/^==([^=]+)==/)
				if (match) return { type: 'highlight', raw: match[0], text: match[1] }
			},
			renderer(token: { text: string }) {
				return `<mark>${token.text}</mark>`
			},
		},
		// H~2~O subscript
		{
			name: 'subscript',
			level: 'inline',
			start(src: string) { return src.indexOf('~') },
			tokenizer(src: string) {
				const match = src.match(/^~([^~]+)~/)
				if (match) return { type: 'subscript', raw: match[0], text: match[1] }
			},
			renderer(token: { text: string }) {
				return `<sub>${token.text}</sub>`
			},
		},
		// E=mc^2^ superscript
		{
			name: 'superscript',
			level: 'inline',
			start(src: string) { return src.indexOf('^') },
			tokenizer(src: string) {
				const match = src.match(/^\^([^^]+)\^/)
				if (match) return { type: 'superscript', raw: match[0], text: match[1] }
			},
			renderer(token: { text: string }) {
				return `<sup>${token.text}</sup>`
			},
		},
		// Definition list: Term\n: Definition
		{
			name: 'deflist',
			level: 'block',
			start(src: string) { return src.search(/^[^\n:][^\n]*\n: /) },
			tokenizer(src: string) {
				const match = src.match(/^((?:[^\n:][^\n]*\n: [^\n]*(?:\n: [^\n]*)*)(?:\n(?:[^\n:][^\n]*\n: [^\n]*(?:\n: [^\n]*)*))*)/)
				if (!match) return
				const raw = match[0]
				const items: { term: string; defs: string[] }[] = []
				const blocks = raw.split(/\n(?=[^\n:])/)
				for (const block of blocks) {
					const lines = block.split('\n')
					const term = lines[0]
					const defs = lines.slice(1).filter(l => l.startsWith(': ')).map(l => l.slice(2))
					if (term && defs.length) items.push({ term, defs })
				}
				if (!items.length) return
				return { type: 'deflist', raw, items }
			},
			renderer(token: { items: { term: string; defs: string[] }[] }) {
				const rows = token.items.map(({ term, defs }) =>
					`<dt>${term}</dt>${defs.map(d => `<dd>${d}</dd>`).join('')}`
				).join('')
				return `<dl>${rows}</dl>`
			},
		},
	],
})

export { marked }
