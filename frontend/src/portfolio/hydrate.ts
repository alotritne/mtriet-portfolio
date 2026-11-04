import type { Locale, Project, SiteData } from '../types'

const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(`.reference-portfolio ${selector}`)
const $$ = <T extends Element = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(`.reference-portfolio ${selector}`)]

function put(selector: string, value: string) {
  const node = $(selector)
  if (node) node.textContent = value
}

// Only trusted, static markup is used for headings with intentional line breaks.
function heading(selector: string, html: string) {
  const node = $(selector)
  if (node) node.innerHTML = html
}

function labelWithArrow(selector: string, label: string) {
  const node = $(selector)
  if (node?.firstChild) node.firstChild.textContent = `${label} `
}

function safeWebUrl(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}

function link(selector: string, url: string | null) {
  const node = $<HTMLAnchorElement>(selector)
  if (node && url) node.href = url
}

const translations = {
  vi: {
    nav: ['Về mình', 'Dự án', 'Kỹ năng', 'Liên hệ', 'Tất cả dự án', 'Blog'],
    hello: 'Xin chào, mình là ',
    hero: 'Biến ý tưởng<br />thành <span class="hero-handwriting">sản phẩm<svg viewBox="0 0 379 25" preserveAspectRatio="none" aria-hidden="true"><path d="M3 20C110-2 238 5 376 12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" /></svg></span><span class="period">.</span>',
    explore: 'Khám phá dự án', contactMe: 'Liên hệ với mình', role: 'Hiện mình đang tìm hiểu', scroll: 'Cuộn xuống để khám phá',
    about: 'Về mình', aboutTitle: 'Học bằng cách<br /><span>tạo ra thứ gì đó.</span>',
    about1: 'Mình thích hiểu cách các phần của một sản phẩm kết nối với nhau — từ API, dữ liệu phía sau đến giao diện mà người dùng trực tiếp tương tác.',
    about2: 'Mỗi dự án là cơ hội để mình thử một công nghệ mới, giải quyết vấn đề thực tế và viết code dễ tiếp tục phát triển.',
    details: ['Họ và tên', 'Ngành học', 'GPA', 'Quan tâm', 'Vị trí'],
    allProjects: 'Xem toàn bộ dự án',
    work: 'Dự án', workTitle: 'Một vài thứ<br />mình đã xây.', workDesc: 'Backend IoT, ứng dụng Android và nhận diện ngôn ngữ ký hiệu — mỗi dự án là một bài toán mới.',
    skills: 'Kỹ năng', skillsTitle: 'Bộ công cụ<br />của mình.', skillsDesc: 'Những ngôn ngữ và công nghệ mình đã sử dụng trong quá trình học và thực hiện dự án.',
    contact: 'Liên hệ', contactTitle: 'Có ý tưởng?<br /><span>Cùng bắt đầu.</span>', contactDesc: 'Mình luôn sẵn sàng trao đổi về dự án, công nghệ và những điều mới để học hỏi.',
    code: 'Xem source code', noCode: 'Chưa có đường dẫn dự án', emptyProjects: 'Chưa có dự án nổi bật được công khai.',
    admin: 'Quản trị', backTop: 'Lên đầu trang ↑',
  },
  en: {
    nav: ['About', 'Projects', 'Skills', 'Contact', 'All projects', 'Blog'],
    hello: "Hi, I'm ",
    hero: 'Turning ideas<br />into <span class="hero-handwriting">products<svg viewBox="0 0 379 25" preserveAspectRatio="none" aria-hidden="true"><path d="M3 20C110-2 238 5 376 12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" /></svg></span><span class="period">.</span>',
    explore: 'Explore projects', contactMe: 'Get in touch', role: 'Currently exploring', scroll: 'Scroll to explore',
    about: 'About', aboutTitle: 'Learning by<br /><span>building things.</span>',
    about1: 'I enjoy understanding how a product fits together — from APIs and backend data to the interface people use every day.',
    about2: 'Every project lets me try new technology, solve practical problems, and write code that others can continue to improve.',
    details: ['Full name', 'Field of study', 'GPA', 'Interests', 'Location'],
    allProjects: 'View all projects',
    work: 'Projects', workTitle: 'Some things<br />I have built.', workDesc: 'IoT backend systems, Android applications, and sign language recognition — each project brings a different challenge.',
    skills: 'Skills', skillsTitle: 'My technical<br />toolkit.', skillsDesc: 'Languages and technologies I have used in my coursework and personal projects.',
    contact: 'Contact', contactTitle: 'Have an idea?<br /><span>Let’s get started.</span>', contactDesc: 'I am always open to conversations about projects, technology, and new things to learn.',
    code: 'View source code', noCode: 'Project link unavailable', emptyProjects: 'No featured projects have been published yet.',
    admin: 'Admin', backTop: 'Back to top ↑',
  },
} as const

function hydrateLanguage(site: SiteData, locale: Locale) {
  const t = translations[locale]
  $$('.site-nav a').forEach((node, i) => { if (t.nav[i]) node.textContent = t.nav[i] })
  const greeting = $('.hero-overline')
  if (greeting?.firstChild) greeting.firstChild.textContent = t.hello
  put('.hero-overline strong', site.name)
  heading('#hero-title', t.hero)
  const city = site.location[locale]
  put('.hero-description', locale === 'vi'
    ? `Sinh viên năm ${site.studentYear} ngành ${site.major.vi} tại ${city}, GPA ${site.gpa}. Mình yêu thích backend, full-stack và phát triển ứng dụng Android.`
    : `Year ${site.studentYear} ${site.major.en} student based in ${city}, GPA ${site.gpa}. Interested in backend development, full-stack web and Android applications.`)
  labelWithArrow('.hero-actions .btn-primary', t.explore)
  put('.hero-actions .btn-outline', t.contactMe)
  put('.role-prefix', t.role)
  const scroll = $('.scroll-cue')
  if (scroll?.lastChild) scroll.lastChild.textContent = t.scroll
  put('.hero-bottom > span', `Based in ${city}, VN`)
  put('#about .section-index', t.about)
  heading('#about-title', t.aboutTitle)
  const paragraphs = $$('#about .about-copy > p')
  if (paragraphs[0]) paragraphs[0].textContent = t.about1
  if (paragraphs[1]) paragraphs[1].textContent = t.about2
  const details = $$('#about .about-details > div')
  const values = [site.name, `${site.major[locale]} · ${locale === 'vi' ? `Sinh viên năm ${site.studentYear}` : `Year ${site.studentYear} student`}`, site.gpa,
    locale === 'vi' ? 'Backend · Full-stack · Android' : 'Backend · Full-stack · Android',
    locale === 'vi' ? `${site.location.vi}, Việt Nam` : `${site.location.en}, Vietnam`]
  details.forEach((row, i) => {
    if (row.firstElementChild) row.firstElementChild.textContent = t.details[i]
    if (row.lastElementChild) row.lastElementChild.textContent = values[i]
  })
  labelWithArrow('.all-projects-link', t.allProjects)
  put('#work .section-index', t.work)
  heading('#work-title', t.workTitle)
  put('#work .section-heading > p', t.workDesc)
  put('#skills .section-index', t.skills)
  heading('#skills-title', t.skillsTitle)
  put('#skills .section-heading > p', t.skillsDesc)
  put('#contact .section-index', t.contact)
  heading('#contact-title', t.contactTitle)
  put('#contact .contact-inner p', t.contactDesc)
  put('.footer-links a[href="/admin"]', t.admin)
  put('.back-top', t.backTop)
  const button = $<HTMLButtonElement>('#language-toggle')
  if (button) {
    button.textContent = locale === 'vi' ? 'EN' : 'VI'
    button.setAttribute('aria-label', locale === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt')
  }
}

function hydrateSkills(site: SiteData, locale: Locale) {
  const grid = $('#skills .skills-grid')
  if (!grid) return
  const groups = site.skills.map((group, i) => {
    const node = document.createElement('div')
    node.className = 'skill-group is-visible'
    const number = document.createElement('span')
    number.className = 'skill-number'
    number.textContent = String(i + 1).padStart(2, '0')
    const title = document.createElement('h3')
    title.textContent = group.label[locale]
    const chips = document.createElement('div')
    for (const item of group.items) {
      const chip = document.createElement('span')
      chip.textContent = item
      chips.append(chip)
    }
    node.append(number, title, chips)
    return node
  })
  grid.replaceChildren(...groups)
}

let originalVisuals: Element[] | null = null
function hydrateProjects(projects: Project[], locale: Locale) {
  const list = $('#work .project-list')
  if (!list) return
  if (!originalVisuals) originalVisuals = $$('#work .project-visual').map(node => node.cloneNode(true) as Element)
  const t = translations[locale]
  if (projects.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'empty-projects'
    empty.textContent = t.emptyProjects
    list.replaceChildren(empty)
    return
  }
  const items = projects.map((project, index) => {
    const article = document.createElement('article')
    article.className = `project-item is-visible ${index % 2 ? 'project-item-reverse' : ''}`
    const name = project.name.toLowerCase()
    const referenceIndex = name.includes('smarthome') && name.includes('backend') ? 0 : name.includes('smarthome') && name.includes('android') ? 1 : name.includes('vsign') ? 2 : -1
    const art = referenceIndex >= 0 ? originalVisuals![referenceIndex].cloneNode(true) as HTMLElement : document.createElement('div')
    if (referenceIndex < 0) {
      art.className = 'project-visual visual-generic'
      const big = document.createElement('span')
      big.className = 'generic-project-symbol'
      big.textContent = '{ }'
      const caption = document.createElement('span')
      caption.className = 'generic-project-caption'
      caption.textContent = project.name
      art.append(big, caption)
    }
    art.setAttribute('aria-label', `${locale === 'vi' ? 'Minh họa' : 'Illustration'}: ${project.name}`)
    const info = document.createElement('div')
    info.className = 'project-info'
    const kind = document.createElement('span')
    kind.className = 'project-type'
    kind.textContent = project.stack.slice(0, 2).join(' / ') || (locale === 'vi' ? 'Dự án' : 'Project')
    const title = document.createElement('h3')
    if (name.startsWith('smarthome ')) {
      title.append(document.createTextNode('SmartHome'), document.createElement('br'), document.createTextNode(project.name.slice(10).trim()))
    } else title.textContent = project.name
    const description = document.createElement('p')
    description.textContent = project.approach?.[locale] || project.problem?.[locale] || ''
    const tags = document.createElement('div')
    tags.className = 'project-tags'
    for (const skill of project.stack) {
      const tag = document.createElement('span')
      tag.textContent = skill
      tags.append(tag)
    }
    const url = safeWebUrl(project.repository)
    const source = document.createElement(url ? 'a' : 'span')
    source.className = url ? 'project-link' : 'project-link project-link-static'
    source.textContent = url ? t.code : t.noCode
    if (url && source instanceof HTMLAnchorElement) {
      source.href = url
      source.target = '_blank'
      source.rel = 'noopener noreferrer'
      const arrow = document.createElement('span')
      arrow.setAttribute('aria-hidden', 'true')
      arrow.textContent = '↗'
      source.append(arrow)
    }
    info.append(kind, title, description, tags, source)
    article.append(art, info)
    return article
  })
  list.replaceChildren(...items)
}

export function hydratePortfolio(site: SiteData, projects: Project[], locale: Locale) {
  hydrateLanguage(site, locale)
  hydrateSkills(site, locale)
  hydrateProjects(projects, locale)
  link('.hero-actions .btn-outline', `mailto:${site.email}`)
  link('.contact-email', `mailto:${site.email}`)
  put('.contact-email', site.email)
  // The decorative arrow is recreated after updating the contact address.
  const emailArrow = document.createElement('span')
  emailArrow.textContent = '↗'
  emailArrow.setAttribute('aria-hidden', 'true')
  $('.contact-email')?.append(emailArrow)
  link('.footer-links a:first-child', safeWebUrl(site.github))
  link('.footer-links a:nth-child(2)', safeWebUrl(site.facebook))
  const footerName = $('.footer-inner > span')
  if (footerName) {
    const year = footerName.querySelector('#year')
    footerName.replaceChildren('© ', year || String(new Date().getFullYear()), ` ${site.name}`)
  }
}
