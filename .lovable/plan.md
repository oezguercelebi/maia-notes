

# Add Formatting Toolbar, Help Modal, and Placeholder Hints

## Overview
Add three ways to help users discover rich-text capabilities: a minimal formatting toolbar, a help modal with a shortcuts cheat sheet, and improved placeholder text.

## Changes

### 1. Formatting Toolbar (new component)
Create `src/components/EditorToolbar.tsx` — a slim bar between the title input and editor content with icon buttons for:
- **Bold** (B), **Italic** (I), **Headings** (H1, H2, H3 dropdown or toggle)
- **Bullet list**, **Ordered list**, **Blockquote**, **Code block**, **Horizontal rule**

Each button calls the corresponding TipTap command (e.g., `editor.chain().focus().toggleBold().run()`). Active states highlighted with the accent color (`#E8FF47`). Styled as a glass bar matching the card aesthetic.

### 2. Help Modal
Add a `?` or `HelpCircle` icon button in the toolbar (or header). Clicking opens a Dialog/Sheet listing supported shortcuts:
- `# ` → Heading 1, `## ` → Heading 2, `### ` → Heading 3
- `- ` or `* ` → Bullet list, `1. ` → Numbered list
- `> ` → Blockquote, `` ``` `` → Code block, `---` → Divider
- `Ctrl+B` → Bold, `Ctrl+I` → Italic

Styled with the existing Dialog component and Maia dark theme.

### 3. Placeholder Hints
Update the TipTap placeholder text to something more descriptive:
`"Start writing... Type # for headings, - for lists, > for quotes, or use the toolbar above"`

### 4. Wire into Index.tsx
- Import and render `EditorToolbar` inside the editor card, between the title input and `EditorContent`
- Add a thin border-bottom separator matching existing style
- Pass the `editor` instance to the toolbar

### Files Modified
- `src/components/EditorToolbar.tsx` — new
- `src/pages/Index.tsx` — add toolbar + help modal, update placeholder
- `src/index.css` — minor toolbar styles if needed

