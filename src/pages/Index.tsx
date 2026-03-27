import { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditorToolbar from "@/components/EditorToolbar";

const STORAGE_KEY = "maia-notes-content";
const TITLE_STORAGE_KEY = "maia-notes-title";

const Index = () => {
  const [title, setTitle] = useState(() => {
    return localStorage.getItem(TITLE_STORAGE_KEY) || "";
  });
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
        blockquote: {},
        codeBlock: {},
        horizontalRule: {},
      }),
      Placeholder.configure({
        placeholder: "Start writing... Type # for headings, - for lists, > for quotes, or use the toolbar above",
      }),
      Typography,
    ],
    content: localStorage.getItem(STORAGE_KEY) || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      localStorage.setItem(STORAGE_KEY, html);
    },
    editorProps: {
      attributes: {
        class: "maia-editor",
      },
    },
  });

  // Store editor ref for actions
  useEffect(() => {
    (editorRef as any).current = editor;
  }, [editor]);

  // Persist title
  useEffect(() => {
    localStorage.setItem(TITLE_STORAGE_KEY, title);
  }, [title]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null && editor) {
        editor.commands.setContent(e.newValue);
      }
      if (e.key === TITLE_STORAGE_KEY && e.newValue !== null) {
        setTitle(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [editor]);

  const copyAll = useCallback(async () => {
    if (!editor) return;
    const text = editor.getText();
    const fullText = title.trim() ? `${title}\n\n${text}` : text;
    await navigator.clipboard.writeText(fullText);
    toast("Copied all notes");
  }, [editor, title]);

  const clearNotes = useCallback(() => {
    if (!editor) return;
    editor.commands.clearContent();
    setTitle("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TITLE_STORAGE_KEY);
    toast("Notes cleared");
    editor.commands.focus();
  }, [editor]);

  const hasContent = editor ? editor.getText().trim().length > 0 : false;
  const hasAnything = hasContent || title.trim().length > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(232, 255, 71, 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1
            className="text-4xl font-normal italic"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            Notes
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyAll}
              disabled={!hasAnything}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!hasAnything) return;
                e.currentTarget.style.background = "rgba(232, 255, 71, 0.1)";
                e.currentTarget.style.borderColor = "rgba(232, 255, 71, 0.3)";
                e.currentTarget.style.color = "#E8FF47";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "";
              }}
            >
              <Copy size={14} />
              Copy All
            </button>

            <button
              onClick={clearNotes}
              disabled={!hasAnything}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!hasAnything) return;
                e.currentTarget.style.background = "rgba(255, 107, 74, 0.15)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 74, 0.4)";
                e.currentTarget.style.color = "#ff6b4a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "";
              }}
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </header>

        {/* Editor Card */}
        <div
          className="flex-1 relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Accent glow at bottom of card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(232, 255, 71, 0.04) 0%, transparent 70%)",
              borderRadius: "inherit",
            }}
          />

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            spellCheck={false}
            className="relative z-10 w-full bg-transparent px-6 pt-4 pb-3 text-foreground outline-none placeholder:text-muted-foreground font-normal italic"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: "1.5rem",
              caretColor: "#E8FF47",
              border: "none",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          />

          {/* TipTap Editor */}
          <EditorContent editor={editor} className="relative z-10 min-h-[55vh] p-6" />
        </div>

        {/* Character/Line Counter — implemented but hidden */}
        <div className="hidden items-center justify-end gap-4 mt-3 px-1">
          <span
            className="text-xs text-muted-foreground"
            style={{
              fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
              letterSpacing: "0.04em",
            }}
          >
            {editor?.getText().split("\n").length || 0} lines
          </span>
          <span
            className="text-xs text-muted-foreground"
            style={{
              fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
              letterSpacing: "0.04em",
            }}
          >
            {editor?.getText().length || 0} chars
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
