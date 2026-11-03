import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { adminApi } from '../lib/api'
import { defaultSite } from '../siteDefaults'
import type { LocalizedText, SiteData } from '../types'

function SkillItemsField({ items, onChange }: { items: string[]; onChange: (next: string[]) => void }) {
  const [text, setText] = useState(() => items.join('\n'))
  return <textarea
    aria-label="Danh sách công nghệ, mỗi dòng một mục"
    rows={Math.min(10, Math.max(3, items.length))}
    value={text}
    onChange={event => {
      const value = event.target.value
      setText(value)
      onChange(value.split(/\r?\n/).map(item => item.trim()).filter(Boolean))
    }}
  />
}

export function SiteEditor() {
  const [draft, setDraft] = useState<SiteData>(structuredClone(defaultSite))
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    adminApi.site().then(site => { if (site) setDraft(site) }).catch(error => setMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu')).finally(() => setStatus('ready'))
  }, [])

  const setLocalized = (key: 'major' | 'location', lang: keyof LocalizedText, value: string) =>
    setDraft(prev => ({ ...prev, [key]: { ...prev[key], [lang]: value } }))

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('saving'); setMessage('')
    try {
      const saved = await adminApi.saveSite(draft)
      setDraft(saved)
      setMessage('Đã lưu. Nội dung mới sẽ hiển thị sau khi tải lại portfolio.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu nội dung')
    } finally { setStatus('ready') }
  }

  return <form className="admin-editor" onSubmit={save}>
    <div className="admin-editor-head"><div><p>SITE CONTENT</p><h2>Hồ sơ & kỹ năng</h2></div><a className="admin-quiet" href="/">Xem trang chủ ↗</a></div>
    {status === 'loading' ? <p role="status">Đang tải dữ liệu…</p> : <>
      <div className="admin-fields two"><label>Họ và tên<input required maxLength={160} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}/></label><label>Năm sinh viên<input required type="number" min={1} max={10} value={draft.studentYear} onChange={e => setDraft({ ...draft, studentYear: Number(e.target.value) })}/></label></div>
      <div className="admin-fields two"><label>Ngành học (VI)<input required value={draft.major.vi} onChange={e => setLocalized('major','vi',e.target.value)}/></label><label>Major (EN)<input required value={draft.major.en} onChange={e => setLocalized('major','en',e.target.value)}/></label></div>
      <div className="admin-fields two"><label>GPA (hệ 4)<input required type="number" min={0} max={4} step="0.01" value={draft.gpa} onChange={e => setDraft({ ...draft, gpa: e.target.value })}/></label><label>Email<input type="email" required value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })}/></label></div>
      <div className="admin-fields two"><label>Địa điểm (VI)<input required value={draft.location.vi} onChange={e => setLocalized('location','vi',e.target.value)}/></label><label>Location (EN)<input required value={draft.location.en} onChange={e => setLocalized('location','en',e.target.value)}/></label></div>
      <div className="admin-fields two">{(['github','facebook','website'] as const).map(key => <label key={key}>{key}<input required type="url" value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })}/></label>)}</div>
      <div className="admin-features"><header><span>Vai trò / Role</span><button type="button" onClick={() => setDraft({ ...draft, roles: [...draft.roles, ''] })}><Plus/>Thêm vai trò</button></header>{draft.roles.map((role, i) => <div className="admin-feature-row" key={i}><input required aria-label={`Vai trò ${i + 1}`} value={role} onChange={e => setDraft({ ...draft, roles: draft.roles.map((item,j) => i === j ? e.target.value : item) })}/><button aria-label={`Xóa vai trò ${i+1}`} type="button" disabled={draft.roles.length === 1} onClick={() => setDraft({ ...draft, roles: draft.roles.filter((_,j) => i !== j) })}><Trash2/></button></div>)}</div>
      <div className="admin-features"><header><span>Nhóm kỹ năng</span><button type="button" onClick={() => setDraft({ ...draft, skills: [...draft.skills, { key: `group${Date.now()}`, label: { vi: 'Nhóm mới', en: 'New group' }, items: [] }] })}><Plus/>Thêm nhóm</button></header>
        {draft.skills.map((group, i) => <div className="site-skill-editor" key={group.key}>
          <div className="admin-fields two"><label>Tên nhóm (VI)<input required value={group.label.vi} onChange={e => setDraft({ ...draft, skills: draft.skills.map((g,j) => i === j ? { ...g, label: { ...g.label, vi: e.target.value } } : g) })}/></label><label>Group (EN)<input required value={group.label.en} onChange={e => setDraft({ ...draft, skills: draft.skills.map((g,j) => i === j ? { ...g, label: { ...g.label, en: e.target.value } } : g) })}/></label></div>
          <div className="admin-fields"><label>Công nghệ (mỗi dòng một mục)<SkillItemsField items={group.items} onChange={items => setDraft(prev => ({ ...prev, skills: prev.skills.map((g,j) => i === j ? { ...g, items } : g) }))}/></label></div>
          <button type="button" className="admin-quiet" onClick={() => setDraft({ ...draft, skills: draft.skills.filter((_,j) => i !== j) })}><Trash2 size={15}/>Xóa nhóm</button>
        </div>)}
      </div>
      {message && <p className="admin-message" role="status">{message}</p>}
      <div className="admin-editor-actions"><button type="submit" className="admin-primary" disabled={status === 'saving'}><Save/>{status === 'saving' ? 'Đang lưu…' : 'Lưu nội dung'}</button></div>
    </>}
  </form>
}
