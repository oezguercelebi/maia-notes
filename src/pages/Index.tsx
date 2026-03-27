import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "maia-notes-content";
const TITLE_STORAGE_KEY = "maia-notes-title";

const Index = () => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [title, setTitle] = useState(() => {
    return localStorage.getItem(TITLE_STORAGE_KEY) || "";
  });
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  useEffect(() => {
    localStorage.setItem(TITLE_STORAGE_KEY, title);
  }, [title]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setContent(e.newValue);
      }
      if (e.key === TITLE_STORAGE_KEY && e.newValue !== null) {
        setTitle(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [content]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        const ta = e.currentTarget;
        const pos = ta.selectionStart;
        const lines = content.substring(0, pos).split("\n");
        const currentLine = lines[lines.length - 1];

        // If current line is just "- " (empty bullet), exit list mode
        if (currentLine === "- ") {
          e.preventDefault();
          const before = content.substring(0, pos - 2);
          const after = content.substring(pos);
          const newContent = before + after;
          setContent(newContent);
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = pos - 2;
          });
          return;
        }

        // If current line starts with "- ", continue bullet
        if (currentLine.startsWith("- ")) {
          e.preventDefault();
          const before = content.substring(0, pos);
          const after = content.substring(pos);
          const newContent = before + "\n- " + after;
          setContent(newContent);
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = pos + 3;
          });
          return;
        }
      }
    },
    [content]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const copyAll = async () => {
    const fullText = title.trim() ? `${title}\n\n${content}` : content;
    await navigator.clipboard.writeText(fullText);
    toast("Copied all notes");
  };

  const clearNotes = () => {
    setContent("");
    setTitle("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TITLE_STORAGE_KEY);
    toast("Notes cleared");
    textareaRef.current?.focus();
  };

  // Split content into sections by headings (# ) or dividers (---)
  const getSections = (): { text: string; startIndex: number }[] => {
    if (!content.trim()) return [];
    const lines = content.split("\n");
    const sections: { text: string; startIndex: number }[] = [];
    let current: string[] = [];
    let startIdx = 0;

    lines.forEach((line, i) => {
      const isHeading = line.startsWith("# ");
      const isDivider = line.trim() === "---";

      if ((isHeading || isDivider) && current.length > 0) {
        sections.push({ text: current.join("\n"), startIndex: startIdx });
        current = [];
        startIdx = i;
      }
      current.push(line);
    });

    if (current.length > 0) {
      sections.push({ text: current.join("\n"), startIndex: startIdx });
    }

    return sections;
  };

  const copySection = async (index: number) => {
    const sections = getSections();
    if (sections[index]) {
      await navigator.clipboard.writeText(sections[index].text);
      setCopiedSection(index);
      toast("Section copied");
      setTimeout(() => setCopiedSection(null), 1500);
    }
  };

  const sections = getSections();
  const lineCount = content.split("\n").length;
  const charCount = content.length;

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
              disabled={!content.trim() && !title.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!content.trim() && !title.trim()) return;
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
              disabled={!content.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!content.trim()) return;
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

          {/* Section copy buttons overlay */}
          {sections.length > 1 && (
            <div className="absolute top-0 right-0 z-20 p-5 flex flex-col gap-1">
              {sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => copySection(i)}
                  className="opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    marginTop:
                      i === 0
                        ? "0"
                        : `${(sections[i].startIndex - sections[i - 1].startIndex) * 1.5}rem`,
                  }}
                  title={`Copy section ${i + 1}`}
                >
                  {copiedSection === i ? (
                    <Check size={12} style={{ color: "#E8FF47" }} />
                  ) : (
                    <Copy size={12} className="text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your notes..."
            spellCheck={false}
            className="relative z-10 w-full h-full min-h-[60vh] resize-none bg-transparent p-6 text-foreground outline-none placeholder:text-muted-foreground"
            style={{
              fontFamily:
                '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
              fontSize: "0.95rem",
              lineHeight: "1.8",
              caretColor: "#E8FF47",
            }}
          />
        </div>

        {/* Character/Line Counter — implemented but hidden */}
        <div className="hidden items-center justify-end gap-4 mt-3 px-1">
          <span
            className="text-xs text-muted-foreground"
            style={{
              fontFamily:
                '"SF Mono", "Fira Code", "Cascadia Code", monospace',
              letterSpacing: "0.04em",
            }}
          >
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
          <span
            className="text-xs text-muted-foreground"
            style={{
              fontFamily:
                '"SF Mono", "Fira Code", "Cascadia Code", monospace',
              letterSpacing: "0.04em",
            }}
          >
            {charCount} {charCount === 1 ? "char" : "chars"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
