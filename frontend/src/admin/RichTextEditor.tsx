import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Code2, Link, Unlink, ImagePlus, Table2, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Minus } from 'lucide-react'

export default function RichTextEditor({ value, onChange, label, disabled = false }: { value: string; onChange: (html: string) => void; label: string; disabled?: boolean }) {
  const [insert, setInsert] = useState<'link' | 'image' | null>(null)
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [error, setError] = useState('')
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, protocols: ['https', 'http', 'mailto'] } }), Image, TableKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: value, editable: !disabled, shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: 'article-prose rich-text-content', role: 'textbox', 'aria-multiline': 'true', 'aria-label': label } },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  })
  useEffect(() => { editor?.setEditable(!disabled, false) }, [editor, disabled])
  if (!editor) return <p role="status">Đang mở trình soạn thảo…</p>
  const controls = [
    { label: 'In đậm', icon: Bold, active: editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
    { label: 'In nghiêng', icon: Italic, active: editor.isActive('italic'), run: () => editor.chain().focus().toggleItalic().run() },
    { label: 'Gạch chân', icon: Underline, active: editor.isActive('underline'), run: () => editor.chain().focus().toggleUnderline().run() },
    { label: 'Gạch ngang', icon: Strikethrough, active: editor.isActive('strike'), run: () => editor.chain().focus().toggleStrike().run() },
    { label: 'Danh sách', icon: List, active: editor.isActive('bulletList'), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: 'Danh sách đánh số', icon: ListOrdered, active: editor.isActive('orderedList'), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: 'Trích dẫn', icon: Quote, active: editor.isActive('blockquote'), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: 'Khối mã', icon: Code2, active: editor.isActive('codeBlock'), run: () => editor.chain().focus().toggleCodeBlock().run() },
    { label: 'Căn trái', icon: AlignLeft, active: editor.isActive({ textAlign: 'left' }), run: () => editor.chain().focus().setTextAlign('left').run() },
    { label: 'Căn giữa', icon: AlignCenter, active: editor.isActive({ textAlign: 'center' }), run: () => editor.chain().focus().setTextAlign('center').run() },
    { label: 'Căn phải', icon: AlignRight, active: editor.isActive({ textAlign: 'right' }), run: () => editor.chain().focus().setTextAlign('right').run() },
  ]
  function openInsert(kind: 'link' | 'image') {
    setInsert(kind); setUrl(kind === 'link' ? String(editor?.getAttributes('link').href || '') : ''); setAlt(''); setError('')
  }
  function applyInsert() {
    try {
      const address = new URL(url.trim())
      if (!(insert === 'image' ? ['https:'] : ['https:', 'http:', 'mailto:']).includes(address.protocol)) throw new Error()
      if (insert === 'image') editor?.chain().focus().setImage({ src: address.href, alt }).run()
      else editor?.chain().focus().extendMarkRange('link').setLink({ href: address.href }).run()
      setInsert(null)
    } catch { setError(insert === 'image' ? 'Nhập đường dẫn ảnh HTTPS hợp lệ.' : 'Nhập liên kết HTTP, HTTPS hoặc mailto hợp lệ.') }
  }
  return <div className="rich-text-editor">
    <div className="editor-toolbar" role="group" aria-label="Định dạng bài viết">
      <select aria-label="Kiểu đoạn văn" disabled={disabled} value={editor.isActive('heading') ? String(editor.getAttributes('heading').level) : 'p'} onChange={event => { const level = event.target.value; if (level === 'p') editor.chain().focus().setParagraph().run(); else editor.chain().focus().toggleHeading({ level: Number(level) as 2 | 3 | 4 }).run() }}><option value="p">Đoạn văn</option><option value="2">Tiêu đề 2</option><option value="3">Tiêu đề 3</option><option value="4">Tiêu đề 4</option></select>
      {controls.map(({ label: name, icon: Icon, active, run }) => <button key={name} type="button" title={name} aria-label={name} aria-pressed={active} disabled={disabled} onClick={run}><Icon size={17} /></button>)}
      <button type="button" title="Chèn liên kết" aria-label="Chèn liên kết" disabled={disabled} onClick={() => openInsert('link')}><Link size={17} /></button>
      <button type="button" title="Bỏ liên kết" aria-label="Bỏ liên kết" disabled={disabled || !editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Unlink size={17} /></button>
      <button type="button" title="Chèn ảnh" aria-label="Chèn ảnh" disabled={disabled} onClick={() => openInsert('image')}><ImagePlus size={17} /></button>
      <button type="button" title="Chèn bảng" aria-label="Chèn bảng" disabled={disabled} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 size={17} /></button>
      <button type="button" title="Đường phân cách" aria-label="Đường phân cách" disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={17} /></button>
      <button type="button" title="Hoàn tác" aria-label="Hoàn tác" disabled={disabled || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={17} /></button>
      <button type="button" title="Làm lại" aria-label="Làm lại" disabled={disabled || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={17} /></button>
    </div>
    {editor.isActive('table') && <div className="editor-table-actions"><button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>Thêm hàng</button><button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>Thêm cột</button><button type="button" onClick={() => editor.chain().focus().deleteRow().run()}>Xóa hàng</button><button type="button" onClick={() => editor.chain().focus().deleteColumn().run()}>Xóa cột</button><button type="button" onClick={() => editor.chain().focus().deleteTable().run()}>Xóa bảng</button></div>}
    {insert && <div className="editor-insert"><label>{insert === 'image' ? 'URL ảnh (HTTPS)' : 'URL liên kết'}<input autoFocus type="url" value={url} onChange={event => setUrl(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); applyInsert() } if (event.key === 'Escape') { setInsert(null); editor.commands.focus() } }} /></label>{insert === 'image' && <label>Mô tả ảnh<input value={alt} onChange={event => setAlt(event.target.value)} /></label>}<button type="button" onClick={applyInsert}>Chèn</button><button type="button" onClick={() => { setInsert(null); editor.commands.focus() }}>Hủy</button>{error && <p role="alert">{error}</p>}</div>}
    <EditorContent editor={editor} />
    <div className="editor-wordcount">{editor.getText().trim().split(/\s+/).filter(Boolean).length} từ · Ctrl/Cmd + Z để hoàn tác</div>
  </div>
}
