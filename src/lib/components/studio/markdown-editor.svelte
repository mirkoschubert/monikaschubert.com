<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import {
		Bold,
		Italic,
		Heading2,
		Heading3,
		Heading4,
		Link,
		Code,
		List,
		ListOrdered,
		Minus,
		Quote
	} from '@lucide/svelte'

	type Props = {
		value: string
		name: string
		rows?: number
		onchange?: (value: string) => void
	}

	let { value = $bindable(''), name, rows = 16, onchange }: Props = $props()

	let container: HTMLDivElement
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let view: any

	const wordCount = $derived(value.trim() === '' ? 0 : value.trim().split(/\s+/).length)
	const charCount = $derived(value.length)

	onMount(async () => {
		const minHeight = `${rows * 1.7 * 0.875}rem`
		const { EditorView, lineNumbers, keymap, highlightActiveLine, drawSelection } = await import('@codemirror/view')
		const { EditorState } = await import('@codemirror/state')
		const { defaultKeymap, historyKeymap, history, indentWithTab } = await import('@codemirror/commands')
		const { markdown, markdownLanguage } = await import('@codemirror/lang-markdown')
		const { languages } = await import('@codemirror/language-data')
		const { syntaxHighlighting, HighlightStyle } = await import('@codemirror/language')
		const { tags } = await import('@lezer/highlight')

		const tokyoNightHighlight = HighlightStyle.define([
			{ tag: tags.heading1, color: '#f7768e', fontWeight: '700' },
			{ tag: tags.heading2, color: '#ff9e64', fontWeight: '700' },
			{ tag: tags.heading3, color: '#e0af68', fontWeight: '600' },
			{ tag: tags.heading4, color: '#e0af68', fontWeight: '600' },
			{ tag: tags.heading, color: '#e0af68', fontWeight: '600' },
			{ tag: tags.strong, color: '#9ece6a', fontWeight: '700' },
			{ tag: tags.emphasis, color: '#7dcfff', fontStyle: 'italic' },
			{ tag: tags.link, color: '#7aa2f7' },
			{ tag: tags.url, color: '#7aa2f7', textDecoration: 'underline' },
			{ tag: tags.monospace, color: '#bb9af7', fontFamily: 'monospace' },
			{ tag: tags.quote, color: '#565f89', fontStyle: 'italic' },
			{ tag: tags.punctuation, color: '#565f89' },
			{ tag: tags.meta, color: '#565f89' },
			{ tag: tags.processingInstruction, color: '#565f89' },
			{ tag: tags.comment, color: '#565f89', fontStyle: 'italic' },
		])

		const baseTheme = EditorView.theme({
			'&': {
				fontSize: '0.875rem',
				fontFamily: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
				background: 'transparent',
				border: '1px solid oklch(1 0 0 / 10%)',
				borderRadius: '0.375rem',
			},
			'&.cm-focused': {
				outline: 'none',
				border: '1px solid oklch(0.55 0 0)',
				boxShadow: '0 0 0 1px oklch(0.55 0 0 / 50%)',
			},
			'.cm-content': {
				padding: '0.5rem 0',
				caretColor: 'oklch(0.95 0 0)',
				color: 'oklch(0.95 0 0)',
				lineHeight: '1.7',
				minHeight,
			},
			'.cm-line': {
				padding: '0 0.75rem',
			},
			'.cm-gutters': {
				background: 'oklch(0.14 0 0)',
				borderRight: '1px solid oklch(1 0 0 / 8%)',
				color: 'oklch(0.45 0 0)',
				borderTopLeftRadius: '0.375rem',
				borderBottomLeftRadius: '0.375rem',
			},
			'.cm-lineNumbers .cm-gutterElement': {
				padding: '0 0.75rem 0 0.5rem',
				minWidth: '2.5rem',
			},
			'.cm-activeLine': {
				background: 'oklch(1 0 0 / 3%)',
			},
			'.cm-activeLineGutter': {
				background: 'oklch(1 0 0 / 5%)',
				color: 'oklch(0.65 0 0)',
			},
			'.cm-cursor': {
				borderLeftColor: 'oklch(0.95 0 0)',
			},
			'.cm-selectionBackground': {
				background: 'oklch(0.55 0.12 264 / 35%) !important',
			},
			'&.cm-focused .cm-selectionBackground': {
				background: 'oklch(0.55 0.12 264 / 45%) !important',
			},
			'.cm-scroller': {
				overflowX: 'auto',
				scrollbarWidth: 'thin',
				scrollbarColor: 'oklch(0.35 0 0) transparent',
			},
			'.cm-scroller::-webkit-scrollbar': {
				height: '6px',
			},
			'.cm-scroller::-webkit-scrollbar-track': {
				background: 'transparent',
			},
			'.cm-scroller::-webkit-scrollbar-thumb': {
				background: 'oklch(0.35 0 0)',
				borderRadius: '3px',
			},
		})

		view = new EditorView({
			state: EditorState.create({
				doc: value,
				extensions: [
					history(),
					lineNumbers(),
					highlightActiveLine(),
					drawSelection(),
					keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
					markdown({ base: markdownLanguage, codeLanguages: languages }),
					syntaxHighlighting(tokyoNightHighlight),
					baseTheme,
					EditorView.updateListener.of((update: { docChanged: boolean; state: { doc: { toString(): string } } }) => {
						if (update.docChanged) {
							value = update.state.doc.toString()
							onchange?.(value)
						}
					}),
					EditorView.lineWrapping,
				],
			}),
			parent: container,
		})
	})

	onDestroy(() => {
		view?.destroy()
	})

	$effect(() => {
		if (!view) return
		const current = view.state.doc.toString()
		if (current !== value) {
			view.dispatch({
				changes: { from: 0, to: current.length, insert: value },
			})
		}
	})

	function wrapSelection(before: string, after: string = before) {
		if (!view) return
		view.focus()
		const { from, to } = view.state.selection.main
		const selected = view.state.sliceDoc(from, to)
		const replacement = selected ? `${before}${selected}${after}` : `${before}${after}`
		view.dispatch({
			changes: { from, to, insert: replacement },
			selection: selected
				? { anchor: from, head: from + replacement.length }
				: { anchor: from + before.length },
		})
	}

	function insertLinePrefix(prefix: string) {
		if (!view) return
		view.focus()
		const { from } = view.state.selection.main
		const line = view.state.doc.lineAt(from)
		if (line.text.startsWith(prefix)) {
			view.dispatch({ changes: { from: line.from, to: line.from + prefix.length, insert: '' } })
		} else {
			view.dispatch({ changes: { from: line.from, insert: prefix } })
		}
	}

	function insertBlock(text: string) {
		if (!view) return
		view.focus()
		const { from, to } = view.state.selection.main
		const line = view.state.doc.lineAt(from)
		const prefix = line.from === from && from === to ? '' : '\n\n'
		view.dispatch({
			changes: { from: to, insert: `${prefix}${text}` },
			selection: { anchor: to + prefix.length + text.length },
		})
	}

	const btnClass = 'flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
	const sepClass = 'mx-0.5 h-4 w-px bg-border'
</script>

<!-- Hidden textarea for form submission -->
<textarea {name} class="sr-only" aria-hidden="true" readonly tabindex="-1">{value}</textarea>

<div class="space-y-1.5">
	<!-- Toolbar -->
	<div class="flex flex-wrap items-center gap-0.5 rounded-md border border-border bg-muted/30 px-1.5 py-1">
		<button type="button" title="Bold" onclick={() => wrapSelection('**')} class={btnClass}>
			<Bold class="size-3.5" />
		</button>
		<button type="button" title="Italic" onclick={() => wrapSelection('_')} class={btnClass}>
			<Italic class="size-3.5" />
		</button>
		<div class={sepClass}></div>
		<button type="button" title="Heading 2" onclick={() => insertLinePrefix('## ')} class={btnClass}>
			<Heading2 class="size-3.5" />
		</button>
		<button type="button" title="Heading 3" onclick={() => insertLinePrefix('### ')} class={btnClass}>
			<Heading3 class="size-3.5" />
		</button>
		<button type="button" title="Heading 4" onclick={() => insertLinePrefix('#### ')} class={btnClass}>
			<Heading4 class="size-3.5" />
		</button>
		<div class={sepClass}></div>
		<button type="button" title="Unordered list" onclick={() => insertLinePrefix('- ')} class={btnClass}>
			<List class="size-3.5" />
		</button>
		<button type="button" title="Ordered list" onclick={() => insertLinePrefix('1. ')} class={btnClass}>
			<ListOrdered class="size-3.5" />
		</button>
		<div class={sepClass}></div>
		<button type="button" title="Blockquote" onclick={() => insertLinePrefix('> ')} class={btnClass}>
			<Quote class="size-3.5" />
		</button>
		<button type="button" title="Inline code" onclick={() => wrapSelection('`')} class={btnClass}>
			<Code class="size-3.5" />
		</button>
		<button type="button" title="Horizontal rule" onclick={() => insertBlock('---')} class={btnClass}>
			<Minus class="size-3.5" />
		</button>
		<button type="button" title="Link" onclick={() => wrapSelection('[', '](url)')} class={btnClass}>
			<Link class="size-3.5" />
		</button>
	</div>

	<!-- CodeMirror mount point -->
	<div bind:this={container}></div>

	<!-- Word / char counter -->
	<div class="flex justify-end gap-3 text-xs text-muted-foreground">
		<span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
		<span>{charCount} {charCount === 1 ? 'char' : 'chars'}</span>
	</div>
</div>
