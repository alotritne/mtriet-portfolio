import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Locale } from '../types'
import { getCopy, localizeSkillItem, profile, skillGroups } from '../data'

type Entry = { command: string; output?: string }

const commands = ['help', 'about', 'skills', 'projects', 'contact', 'clear'] as const

function FormattedTerminalOutput({ text, command }: { text?: string; command: string }) {
  if (!text) return null
  return (
    <output className={`terminal-output is-${command}`}>
      {text.split('\n').map((line, index) => {
        const separatorIndex = line.indexOf(' : ')
        if (separatorIndex >= 0) {
          return <span className="terminal-output-row" key={`${line}-${index}`}><b>{line.slice(0, separatorIndex).trim()}</b><i>:</i><span>{line.slice(separatorIndex + 3)}</span></span>
        }
        if (line.endsWith(':')) return <strong className="terminal-output-heading" key={`${line}-${index}`}>{line}</strong>
        return <span className="terminal-output-message" key={`${line}-${index}`}>{line}</span>
      })}
    </output>
  )
}

export function PortfolioTerminal({ locale }: { locale: Locale }) {
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<Entry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const skillLabels = getCopy(locale).groupLabels
  const skillRows = skillGroups.map(group => ({
    label: skillLabels[group.key],
    items: group.items.map(item => localizeSkillItem(item, locale)),
  }))
  const skillLabelWidth = Math.max(...skillRows.map(row => row.label.length))
  const skillSummary = skillRows.map(row => `${row.label.padEnd(skillLabelWidth)} : ${row.items.join(' · ')}`).join('\n')

  const messages = locale === 'vi' ? {
    welcome: 'Chào bạn. Đây là một cách khác để khám phá portfolio.',
    hint: 'Gõ “help” để xem danh sách lệnh.',
    help: 'help · about · skills · projects · contact · clear',
    about: `Tên       : ${profile.name}\nNgành     : ${profile.major.vi}\nSinh viên : Năm ${profile.studentYear}\nGPA       : ${profile.gpa}\nĐịa điểm  : ${profile.location.vi}`,
    skills: skillSummary,
    projects: 'Đang chuyển đến phần dự án…',
    contact: `Kênh liên hệ:\nEmail    : ${profile.email}\nGitHub   : ${profile.github.replace('https://', '')}\nFacebook : ${profile.facebook.replace('https://www.', '').replace(/\/$/, '')}\nWebsite  : ${profile.website.replace('https://', '').replace(/\/$/, '')}`,
    unknown: 'Không tìm thấy lệnh. Gõ “help” để xem danh sách.',
    label: 'Terminal tương tác của portfolio',
    placeholder: 'Nhập một lệnh…',
    title: 'PORTFOLIO TERMINAL', status: 'SẴN SÀNG', quickLabel: 'Lệnh nhanh',
  } : {
    welcome: 'Welcome. This is another way to explore the portfolio.',
    hint: 'Type “help” to see the command list.',
    help: 'help · about · skills · projects · contact · clear',
    about: `Name      : ${profile.name}\nMajor     : ${profile.major.en}\nYear      : Year ${profile.studentYear}\nGPA       : ${profile.gpa}\nLocation  : ${profile.location.en}`,
    skills: skillSummary,
    projects: 'Moving to the projects section…',
    contact: `Contact channels:\nEmail    : ${profile.email}\nGitHub   : ${profile.github.replace('https://', '')}\nFacebook : ${profile.facebook.replace('https://www.', '').replace(/\/$/, '')}\nWebsite  : ${profile.website.replace('https://', '').replace(/\/$/, '')}`,
    unknown: 'Command not found. Type “help” to see the list.',
    label: 'Interactive portfolio terminal',
    placeholder: 'Enter a command…',
    title: 'PORTFOLIO TERMINAL', status: 'READY', quickLabel: 'Quick commands',
  }

  const run = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase()
    if (!command) return
    if (command === 'clear') {
      setHistory([])
      setValue('')
      return
    }

    const output = commands.includes(command as typeof commands[number])
      ? messages[command as keyof Pick<typeof messages, 'help' | 'about' | 'skills' | 'projects' | 'contact'>]
      : messages.unknown
    setHistory(items => [...items.slice(-5), { command, output }])
    setValue('')
    setHistoryIndex(-1)
    if (command === 'projects') requestAnimationFrame(() => document.querySelector('#projects')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') run(value)
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const commandHistory = history.map(item => item.command)
      if (!commandHistory.length) return
      const next = Math.min(historyIndex + 1, commandHistory.length - 1)
      setHistoryIndex(next)
      setValue(commandHistory[commandHistory.length - 1 - next])
    }
    if (event.key === 'Escape') {
      setValue('')
      setHistoryIndex(-1)
    }
  }

  return (
    <aside className="portfolio-terminal" aria-label={messages.label} onClick={() => inputRef.current?.focus()}>
      <header><span>{messages.title}</span><span>{messages.status}</span></header>
      <div className="terminal-screen">
        <p className="terminal-welcome"><i aria-hidden="true" />{messages.welcome}</p>
        <p className="terminal-hint">{messages.hint}</p>
        <div aria-live="polite">{history.map((entry, index) => <div className="terminal-entry" key={`${entry.command}-${index}`}><p><span>portfolio ›</span> {entry.command}</p><FormattedTerminalOutput text={entry.output} command={entry.command} /></div>)}</div>
        <label className="terminal-input"><span aria-hidden="true">portfolio ›</span><span className="sr-only">{messages.placeholder}</span><input ref={inputRef} value={value} onChange={event => setValue(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label={messages.placeholder} /></label>
      </div>
      <footer className="terminal-actions" aria-label={messages.quickLabel}>
        {commands.filter(command => command !== 'clear').map(command => <button type="button" key={command} onClick={event => { event.stopPropagation(); run(command) }}>{command}</button>)}
      </footer>
    </aside>
  )
}
