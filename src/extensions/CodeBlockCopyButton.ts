import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const CodeBlockCopyButton = Extension.create({
  name: "codeBlockCopyButton",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("codeBlockCopyButton"),
        view() {
          return {
            update(view) {
              const preElements = view.dom.querySelectorAll("pre");
              preElements.forEach((pre) => {
                if (pre.querySelector(".code-copy-btn")) return;

                pre.style.position = "relative";

                const btn = document.createElement("button");
                btn.className = "code-copy-btn";
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                btn.title = "Copy code";
                btn.contentEditable = "false";

                btn.addEventListener("mousedown", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const code = pre.querySelector("code");
                  const text = code ? code.textContent || "" : pre.textContent || "";
                  navigator.clipboard.writeText(text).then(() => {
                    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                    setTimeout(() => {
                      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                    }, 1500);
                  });
                });

                pre.appendChild(btn);
              });
            },
          };
        },
      }),
    ];
  },
});

export default CodeBlockCopyButton;
