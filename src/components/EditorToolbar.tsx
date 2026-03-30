import { Editor } from "@tiptap/react";
import { useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({ onClick, isActive, children, title }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md transition-colors duration-150 ${
      isActive
        ? "text-accent bg-accent/15"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-4 bg-border mx-1" />
);

const shortcuts = [
  { keys: "#", desc: "Heading 1" },
  { keys: "##", desc: "Heading 2" },
  { keys: "###", desc: "Heading 3" },
  { keys: "- or *", desc: "Bullet list" },
  { keys: "1.", desc: "Numbered list" },
  { keys: ">", desc: "Blockquote" },
  { keys: "```", desc: "Code block" },
  { keys: "---", desc: "Divider" },
  { keys: "Ctrl+B", desc: "Bold" },
  { keys: "Ctrl+I", desc: "Italic" },
  { keys: "Ctrl+Shift+X", desc: "Strikethrough" },
];

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const run = (fn: (chain: ReturnType<typeof editor.chain>) => ReturnType<typeof editor.chain>) => {
    fn(editor.chain().focus()).run();
  };

  return (
    <div
      className="relative z-10 flex items-center gap-0.5 px-4 py-1.5 overflow-x-auto"
      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
    >
      <ToolbarButton
        onClick={() => run(c => c.toggleBold())}
        isActive={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => run(c => c.toggleItalic())}
        isActive={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => run(c => c.toggleHeading({ level: 1 }))}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => run(c => c.toggleHeading({ level: 2 }))}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => run(c => c.toggleHeading({ level: 3 }))}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => run(c => c.toggleBulletList())}
        isActive={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => run(c => c.toggleOrderedList())}
        isActive={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => run(c => c.toggleBlockquote())}
        isActive={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => run(c => c.toggleCodeBlock())}
        isActive={editor.isActive("codeBlock")}
        title="Code block"
      >
        <Code2 size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => run(c => c.setHorizontalRule())}
        isActive={false}
        title="Divider"
      >
        <Minus size={15} />
      </ToolbarButton>

      <div className="flex-1" />

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            title="Keyboard shortcuts"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          >
            <HelpCircle size={15} />
          </button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-md"
          style={{
            background: "hsl(0 0% 7%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-lg font-normal italic"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              Formatting Shortcuts
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Use these shortcuts while typing to format your notes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-2">
            {shortcuts.map((s) => (
              <div key={s.keys} className="flex items-center justify-between py-1">
                <span className="text-sm text-foreground">{s.desc}</span>
                <kbd
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    color: "hsl(var(--accent))",
                  }}
                >
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditorToolbar;
