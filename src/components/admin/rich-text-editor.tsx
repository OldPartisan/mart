"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Link2, List, ListOrdered, Redo2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noreferrer noopener" } }),
      Placeholder.configure({ placeholder: "Текст блока…" }),
    ],
    content: value || "<p></p>",
    editorProps: { attributes: { class: "prose-irbis min-h-[130px] px-3 py-2 text-[13px] outline-none" } },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || "<p></p>", false);
  }, [editor, value]);

  if (!editor) return <div className="min-h-[170px] rounded-xl border border-line bg-white" />;

  const button = (active: boolean) =>
    cn("flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-cream hover:text-ink", active && "bg-brand-100 text-brand-900");

  return (
    <div className="rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line p-1.5">
        <button type="button" className={button(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Жирный"><Bold className="h-4 w-4" /></button>
        <button type="button" className={button(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Курсив"><Italic className="h-4 w-4" /></button>
        <button type="button" className={button(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Список"><List className="h-4 w-4" /></button>
        <button type="button" className={button(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Нумерованный список"><ListOrdered className="h-4 w-4" /></button>
        <button type="button" className={button(editor.isActive("link"))} onClick={() => { const url = window.prompt("Ссылка", "https://"); if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run(); else editor.chain().focus().unsetLink().run(); }} aria-label="Ссылка"><Link2 className="h-4 w-4" /></button>
        <span className="mx-1 h-5 w-px bg-line" />
        <button type="button" className={button(false)} onClick={() => editor.chain().focus().undo().run()} aria-label="Отменить"><Undo2 className="h-4 w-4" /></button>
        <button type="button" className={button(false)} onClick={() => editor.chain().focus().redo().run()} aria-label="Повторить"><Redo2 className="h-4 w-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
