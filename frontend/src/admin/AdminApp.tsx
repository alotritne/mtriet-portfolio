import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, LogOut, Plus, Save, Trash2 } from 'lucide-react'
import { adminApi } from '../lib/api'
import { projects as fallbackProjects } from '../data'
import type { Project } from '../types'

const emptyProject = (): Project => ({
  id: '', slug: '', name: '', problem: { vi: '', en: '' }, approach: { vi: '', en: '' },
  features: [], stack: [], repository: '', featured: true, published: true, position: 0,
})

function ProjectEditor({ project, onCancel, onSaved }: { project: Project; onCancel: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState<Project>(structuredClone(project))
  const [stackText, setStackText] = useState(project.stack.join(', '))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const updateLocalized = (field: 'problem' | 'approach', locale: 'vi' | 'en', value: string) => setDraft(current => ({ ...current, [field]: { ...current[field], [locale]: value } }))
  const updateFeature = (index: number, locale: 'vi' | 'en', value: string) => setDraft(current => ({ ...current, features: current.features.map((feature, featureIndex) => featureIndex === index ? { ...feature, [locale]: value } : feature) }))

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage('')
    try {
      await adminApi.save({ ...draft, slug: draft.slug || draft.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), stack: stackText.split(',').map(item => item.trim()).filter(Boolean) })
      onSaved()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Không thể lưu dự án') }
    finally { setSaving(false) }
  }

  return <form className="admin-editor" onSubmit={submit}>
    <div className="admin-editor-head"><div><p>PROJECT EDITOR</p><h1>{draft.databaseId ? 'Chỉnh sửa dự án' : 'Thêm dự án'}</h1></div><button type="button" className="admin-quiet" onClick={onCancel}>Đóng</button></div>
    <div className="admin-fields two"><label>Tên dự án<input required value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label><label>Slug<input pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={event => setDraft({ ...draft, slug: event.target.value })} placeholder="Tự tạo từ tên nếu để trống" /></label></div>
    <div className="admin-fields two"><label>Bài toán · VI<textarea required value={draft.problem.vi} onChange={event => updateLocalized('problem', 'vi', event.target.value)} /></label><label>Problem · EN<textarea required value={draft.problem.en} onChange={event => updateLocalized('problem', 'en', event.target.value)} /></label></div>
    <div className="admin-fields two"><label>Cách tiếp cận · VI<textarea required value={draft.approach.vi} onChange={event => updateLocalized('approach', 'vi', event.target.value)} /></label><label>Approach · EN<textarea required value={draft.approach.en} onChange={event => updateLocalized('approach', 'en', event.target.value)} /></label></div>
    <section className="admin-features"><header><span>Tính năng song ngữ</span><button type="button" onClick={() => setDraft({ ...draft, features: [...draft.features, { vi: '', en: '' }] })}><Plus />Thêm dòng</button></header>{draft.features.map((feature, index) => <div className="admin-feature-row" key={index}><input required aria-label={`Tính năng ${index + 1} tiếng Việt`} value={feature.vi} onChange={event => updateFeature(index, 'vi', event.target.value)} placeholder="Tiếng Việt" /><input required aria-label={`Feature ${index + 1} English`} value={feature.en} onChange={event => updateFeature(index, 'en', event.target.value)} placeholder="English" /><button type="button" aria-label={`Xóa tính năng ${index + 1}`} onClick={() => setDraft({ ...draft, features: draft.features.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 /></button></div>)}</section>
    <div className="admin-fields two"><label>Stack, cách nhau bằng dấu phẩy<input value={stackText} onChange={event => setStackText(event.target.value)} /></label><label>Repository<input type="url" value={draft.repository || ''} onChange={event => setDraft({ ...draft, repository: event.target.value })} placeholder="https://github.com/..." /></label></div>
    <div className="admin-fields compact"><label>Thứ tự<input type="number" min="0" max="999" value={draft.position || 0} onChange={event => setDraft({ ...draft, position: Number(event.target.value) })} /></label><label className="admin-check"><input type="checkbox" checked={draft.featured ?? true} onChange={event => setDraft({ ...draft, featured: event.target.checked })} />Nổi bật</label><label className="admin-check"><input type="checkbox" checked={draft.published ?? true} onChange={event => setDraft({ ...draft, published: event.target.checked })} />Công khai</label></div>
    {message && <p className="admin-message is-error" role="alert">{message}</p>}
    <div className="admin-editor-actions"><button type="submit" className="admin-primary" disabled={saving}><Save />{saving ? 'Đang lưu…' : 'Lưu dự án'}</button></div>
  </form>
}

export function AdminApp() {
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Project[]>([])
  const [editing, setEditing] = useState<Project | null>(null)
  const [error, setError] = useState('')

  const loadProjects = async () => { setItems(await adminApi.projects()) }
  useEffect(() => { adminApi.restore().then(user => { setAdmin(user); return loadProjects() }).catch(() => undefined).finally(() => setLoading(false)) }, [])

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    const form = new FormData(event.currentTarget)
    try { const user = await adminApi.login(String(form.get('email')), String(form.get('password'))); setAdmin(user); await loadProjects() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể đăng nhập') }
  }

  if (loading) return <main className="admin-auth"><p>Đang kiểm tra phiên đăng nhập…</p></main>
  if (!admin) return <main className="admin-auth"><a href="/"><ArrowLeft />Quay lại portfolio</a><form onSubmit={login}><p>PORTFOLIO ADMIN</p><h1>Đăng nhập để chỉnh sửa</h1><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" minLength={10} required /></label>{error && <p className="admin-message is-error" role="alert">{error}</p>}<button className="admin-primary" type="submit">Đăng nhập</button></form></main>
  if (editing) return <main className="admin-page"><ProjectEditor project={editing} onCancel={() => setEditing(null)} onSaved={async () => { await loadProjects(); setEditing(null) }} /></main>

  const importFallback = async () => {
    setError('')
    try { for (const [index, project] of fallbackProjects.entries()) await adminApi.save({ ...project, id: '', slug: project.id, position: index, featured: project.id !== 'algo-tournament', published: true }); await loadProjects() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể nhập dữ liệu hiện tại') }
  }
  return <main className="admin-page"><header className="admin-topbar"><div><p>PORTFOLIO ADMIN</p><h1>Quản lý dự án</h1><span>{admin.email}</span></div><div><a href="/"><ArrowLeft />Xem portfolio</a><button onClick={async () => { await adminApi.logout(); setAdmin(null) }}><LogOut />Đăng xuất</button></div></header><section className="admin-workspace"><div className="admin-workspace-head"><p>{items.length} dự án trong MongoDB</p><button className="admin-primary" onClick={() => setEditing(emptyProject())}><Plus />Thêm dự án</button></div>{error && <p className="admin-message is-error" role="alert">{error}</p>}{items.length === 0 ? <div className="admin-empty"><h2>Database chưa có dự án</h2><p>Nhập các dự án hiện đang có trong portfolio để bắt đầu chỉnh sửa bằng trang quản trị.</p><button onClick={importFallback}>Nhập dữ liệu hiện tại</button></div> : <div className="admin-project-list">{items.map(project => <article key={project.databaseId}><div><span>{String((project.position || 0) + 1).padStart(2, '0')}</span><h2>{project.name}</h2><p>{project.published ? 'Đang công khai' : 'Bản nháp'} · {project.stack.join(' · ')}</p></div><div><button onClick={() => setEditing(project)}>Chỉnh sửa</button><button className="is-danger" onClick={async () => { if (project.databaseId && window.confirm(`Xóa ${project.name}?`)) { await adminApi.remove(project.databaseId); await loadProjects() } }}><Trash2 />Xóa</button></div></article>)}</div>}</section></main>
}
