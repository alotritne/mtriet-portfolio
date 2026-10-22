import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react'
import { ArrowUpRight, Eye, Plus, Save, Trash2 } from 'lucide-react'
import { adminApi, ApiError } from '../lib/api'
import type { BlogPost, Locale } from '../types'
import { ArticleBody } from '../blog/ArticleBody'

const RichTextEditor = lazy(() => import('./RichTextEditor'))
const emptyPost = (): BlogPost => ({ slug: '', title: { vi: '', en: '' }, excerpt: { vi: '', en: '' }, content: { vi: '', en: '' }, tags: [], published: false })
const slugify = (title: string) => title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100).replace(/-$/, '')

function PostEditor({ post, onClose, onSaved, onDirtyChange }: { post: BlogPost; onClose: () => void; onSaved: () => void; onDirtyChange: (dirty: boolean) => void }) {
  const [draft, setDraft] = useState<BlogPost>(() => structuredClone(post))
  const [saved, setSaved] = useState(JSON.stringify(post))
  const [locale, setLocale] = useState<Locale>('vi')
  const [tags, setTags] = useState(post.tags.join(', '))
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const dirty = JSON.stringify(draft) !== saved
  useEffect(() => { onDirtyChange(dirty || saving); return () => onDirtyChange(false) }, [dirty, saving, onDirtyChange])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const update = (field: 'title' | 'excerpt' | 'content', value: string) => {
    setDraft(current => ({ ...current, [field]: { ...current[field], [locale]: value } })); setMessage('')
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setError(''); setMessage(''); setSaving(true)
    try {
      const result = await adminApi.savePost({ ...draft, slug: draft.slug || slugify(draft.title.vi || draft.title.en) })
      setDraft(result); setSaved(JSON.stringify(result)); onSaved()
      setMessage(result.published ? 'Đã lưu và xuất bản bài viết.' : 'Đã lưu bản nháp vào MongoDB.')
    } catch (reason) {
      const messages: Record<number, string> = {
        400: 'Kiểm tra đường dẫn (ít nhất 2 ký tự), số chủ đề và nội dung hai ngôn ngữ trước khi xuất bản.',
        409: 'Đường dẫn này đã được sử dụng. Hãy chọn đường dẫn khác.',
        413: 'Bài viết quá lớn. Hãy rút gọn nội dung rồi thử lại.',
        401: 'Phiên đăng nhập đã hết hạn. Sao chép nội dung trước khi đăng nhập lại.',
      }
      setError(`Chưa lưu được bài viết. ${reason instanceof ApiError ? messages[reason.status] || 'Vui lòng thử lại.' : 'Kiểm tra kết nối rồi thử lại. Nội dung vẫn còn trong trình soạn thảo.'}`)
    }
    finally { setSaving(false) }
  }
  return <form className="admin-editor blog-editor" onSubmit={save}>
    <header className="admin-editor-head"><div><p>BLOG</p><h2>{draft.id ? 'Chỉnh sửa bài viết' : 'Bài viết mới'}</h2></div><button className="admin-quiet" type="button" disabled={saving} onClick={() => { if (!dirty || window.confirm('Bạn có thay đổi chưa lưu. Đóng trình soạn thảo?')) onClose() }}>Đóng</button></header>
    <p className="editor-help">Lưu bản nháp bất cứ lúc nào. Khi xuất bản, hãy hoàn tất tiêu đề, mô tả và nội dung ở cả hai ngôn ngữ.</p>
    <fieldset disabled={saving}>
      <div className="admin-fields two"><label>Đường dẫn bài viết<input value={draft.slug} maxLength={100} minLength={2} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" onChange={event => setDraft({ ...draft, slug: event.target.value })} placeholder="Tự tạo từ tiêu đề nếu để trống" /></label><label>Chủ đề (tối đa 8, cách nhau bằng dấu phẩy)<input value={tags} onChange={event => { setTags(event.target.value); setDraft({ ...draft, tags: [...new Set(event.target.value.split(',').map(tag => tag.trim()).filter(Boolean))] }) }} placeholder="React, Backend" /></label></div>
      <div className="editor-controls"><div className="editor-languages" role="group" aria-label="Ngôn ngữ bài viết">{(['vi', 'en'] as const).map(language => <button key={language} type="button" aria-pressed={locale === language} onClick={() => setLocale(language)}>{language === 'vi' ? 'Tiếng Việt' : 'English'}</button>)}</div><button type="button" className="admin-quiet" aria-pressed={preview} onClick={() => setPreview(!preview)}><Eye size={16} />{preview ? 'Tiếp tục viết' : 'Xem trước'}</button></div>
      <div className="admin-fields"><label>{locale === 'vi' ? 'Tiêu đề · VI' : 'Title · EN'}<input maxLength={180} value={draft.title[locale]} onChange={event => update('title', event.target.value)} /></label><label>{locale === 'vi' ? 'Mô tả ngắn · VI' : 'Excerpt · EN'}<textarea maxLength={500} value={draft.excerpt[locale]} onChange={event => update('excerpt', event.target.value)} /></label></div>
      {preview ? <section className="article-preview" aria-label="Xem trước bài viết"><h2>{draft.title[locale]}</h2><p>{draft.excerpt[locale]}</p><ArticleBody html={draft.content[locale]} /></section>
        : <><p className="editor-content-label">{locale === 'vi' ? 'Nội dung · VI' : 'Content · EN'}</p><Suspense fallback={<p role="status">Đang tải trình soạn thảo…</p>}><RichTextEditor key={locale} label={`Nội dung ${locale}`} value={draft.content[locale]} disabled={saving} onChange={value => update('content', value)} /></Suspense><p className="editor-help">Ảnh: chèn bằng URL HTTPS. Dùng bảng, trích dẫn hoặc khối mã để trình bày nội dung.</p></>}
      <label className="admin-check blog-publish"><input type="checkbox" checked={draft.published} onChange={event => setDraft({ ...draft, published: event.target.checked })} />Công khai sau khi lưu</label>
    </fieldset>
    {error && <p className="admin-message is-error" role="alert">{error}</p>}
    <p role="status" className="editor-status">{saving ? 'Đang lưu bài viết…' : message || (dirty ? 'Có thay đổi chưa lưu' : 'Không có thay đổi chưa lưu')}</p>
    <div className="admin-editor-actions"><button className="admin-primary" type="submit" disabled={saving}><Save size={18} />{saving ? 'Đang lưu…' : draft.published ? 'Lưu và xuất bản' : 'Lưu bản nháp'}</button>{draft.id && draft.published && !dirty && <a className="button" href={`/blog/${draft.slug}`} target="_blank" rel="noreferrer">Xem bài viết<ArrowUpRight size={16} /></a>}</div>
  </form>
}

export function BlogManager({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [removing, setRemoving] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    adminApi.posts().then(items => { if (active) setPosts(items) }).catch(() => { if (active) setError('Không tải được bài viết. Vui lòng thử lại.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [revision])
  if (editing) return <PostEditor post={editing} onClose={() => setEditing(null)} onSaved={() => setRevision(value => value + 1)} onDirtyChange={onDirtyChange} />
  return <section className="admin-workspace blog-admin-workspace"><div className="admin-workspace-head"><p>{posts.length} bài viết</p><button className="admin-primary" onClick={() => setEditing(emptyPost())}><Plus />Viết bài mới</button></div>
    {error && <div role="alert"><p className="admin-message is-error">{error}</p><button className="button" onClick={() => setRevision(value => value + 1)}>Thử lại</button></div>}
    {loading ? <p role="status">Đang tải bài viết…</p> : !error && !posts.length ? <div className="admin-empty"><h2>Bắt đầu bài viết đầu tiên</h2><p>Viết về một quyết định kỹ thuật, một bài học hoặc cách bạn giải quyết vấn đề.</p></div> : <div className="admin-project-list">{posts.map(post => <article key={post.id}><div><span>{post.published ? 'Đang công khai' : 'Bản nháp'}</span><h2>{post.title.vi || post.title.en}</h2><p>/blog/{post.slug}</p></div><div><button onClick={() => setEditing(post)}>Chỉnh sửa</button><button className="is-danger" disabled={removing === post.id} onClick={async () => {
      if (!post.id || !window.confirm(`Xóa bài viết “${post.title.vi || post.title.en}”?`)) return
      setRemoving(post.id); setError('')
      try { await adminApi.removePost(post.id); setRevision(value => value + 1) }
      catch { setError('Không xóa được bài viết. Vui lòng thử lại.') }
      finally { setRemoving(null) }
    }}><Trash2 size={16} />{removing === post.id ? 'Đang xóa…' : 'Xóa'}</button></div></article>)}</div>}
  </section>
}
