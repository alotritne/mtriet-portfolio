# Portfolio Agent Instructions

## Project objective

Build and maintain a premium personal portfolio for Nguyễn Ngọc Minh Triết. The portfolio must demonstrate software-engineering ability through product thinking, architecture, technical decisions, and project outcomes—not merely list personal information.

Primary goals:

- Apply for internships and fresher software-engineering roles.
- Find suitable freelance opportunities.
- Build a credible personal brand.
- Showcase full-stack, backend, mobile, and software-engineering skills.

## Personal context

- Name: Nguyễn Ngọc Minh Triết
- Role: Information Technology student
- Location: Vietnam
- Website: https://mtriet.is-a.dev/
- Email: mtri3t.dev@gmail.com
- Facebook: https://www.facebook.com/alotritne/
- GitHub: https://github.com/alotritne
- Target roles: Full-stack Developer, Backend Developer, Software Engineer, Mobile Developer
- Do not use a profile photo until one is explicitly provided.

Never invent education details, work experience, achievements, metrics, project links, screenshots, or personal claims. Mark missing information clearly or ask for it when it materially affects the result.

## Language

- Support Vietnamese and English.
- Detect the initial language from the browser locale.
- Default to Vietnamese when detection is unavailable.
- Always provide a visible manual language switcher.
- Remember the user's manual language choice locally.
- Keep Vietnamese and English content semantically equivalent.
- Do not mix languages within a section except for established technical terms.

## Engineering principles

- Think and work like a senior software engineer.
- Prefer simple, maintainable architecture over clever abstractions.
- Explain material architectural decisions and tradeoffs.
- Keep code production-ready, readable, and easy to extend.
- Avoid unnecessary dependencies and complexity.
- Reuse components and shared data structures.
- Avoid duplicated markup, content, styles, and business logic.
- Keep portfolio content separate from presentation when practical.
- Preserve consistency across naming, spacing, colors, interactions, and responsive behavior.
- Do not rewrite working project structure without a concrete benefit.

## Preferred technology

When starting a new implementation without an existing required stack, prefer:

- React
- TypeScript
- Vite
- TailwindCSS

Respect an existing project's framework, package manager, lockfile, and conventions. Do not migrate technologies unless explicitly requested.

## Design direction

The visual system must be:

- Dark-mode first
- Modern, minimal, premium, and elegant
- Responsive and performance-focused
- Inspired by terminal, Linux, and restrained cyber aesthetics
- Original; do not copy an existing portfolio or design
- Free from generic AI-generated or template-like patterns

Use restrained glow, grid, terminal, or system-status motifs only when they communicate structure or identity. Avoid excessive neon, random gradients, gratuitous glassmorphism, particle effects, fake terminals, decorative code, and animations without purpose.

Typography, spacing, hierarchy, and composition should create most of the visual quality. Effects must remain secondary.

## Interaction and motion

- Use smooth, meaningful feedback for navigation, hover, focus, filtering, and section transitions.
- Prefer CSS transitions and lightweight motion.
- Respect `prefers-reduced-motion`.
- Do not delay access to content with intro animations or loading screens.
- Ensure interactions work with mouse, keyboard, touch, and screen readers where applicable.

## Accessibility

- Use semantic HTML landmarks and a logical heading hierarchy.
- Provide visible keyboard focus states.
- Maintain readable contrast in dark mode.
- Use descriptive link and button labels.
- Do not rely on color alone to communicate state.
- Add alternative text only when imagery communicates content; use empty alt text for decorative images.
- Test navigation and primary actions using the keyboard.

## Performance

- Keep the initial page lightweight.
- Avoid large libraries for small effects.
- Optimize and lazy-load noncritical media.
- Prevent layout shift by reserving media dimensions.
- Minimize client-side JavaScript and unnecessary state.
- Prefer static content and progressive enhancement.
- Do not sacrifice readability or accessibility for benchmark scores.

## Information architecture

Prefer a focused single-page experience unless the content clearly requires multiple routes. Include:

1. Hero with name, role, concise positioning, and primary actions
2. About section showing engineering mindset
3. Technical capabilities grouped by domain
4. Selected projects with problem, approach, technology, and outcome
5. Contact and verified social links

Project presentation should show engineering decisions and contribution rather than only screenshots or technology badges. When information is available, describe:

- The problem being solved
- The user's role and responsibilities
- Architecture or technical approach
- Important features
- Difficult tradeoffs or challenges
- Outcome and lessons learned

## Verified technology profile

### Languages

- C++
- Java
- Kotlin
- JavaScript
- Python
- TypeScript

### Frontend

- React
- Vite
- TailwindCSS

### Backend

- Node.js
- Express
- Prisma

### Databases

- MySQL
- MongoDB

### Mobile

- Android
- Jetpack Compose

### Other

- MQTT
- Git and GitHub
- Docker at a basic level
- REST API
- JWT Authentication

Do not imply expert-level proficiency or years of experience unless explicitly provided.

## Project source of truth

### SmartHome Backend

- Stack: Node.js, Express, Prisma, MySQL, MQTT
- Features: JWT authentication, refresh tokens, device claiming, real-time sensor data, REST API, Swagger
- Repository: https://github.com/Phon0816/SmartHome-Backend

### SmartHome Android

- Stack: Android, Kotlin, Jetpack Compose
- Features: login, registration, dashboard, device management, MVVM, Retrofit, Hilt
- Repository: https://github.com/Phon0816/LTDPT-SmartHome-AndroidApp

### VSign

- Purpose: Vietnamese Sign Language recognition
- Stack/features: TensorFlow, MediaPipe, LSTM, TFLite, camera recognition
- Repository URL has not been provided; do not invent one.
- Ứng dụng học ngôn ngữ kí hiệu kết hợp AI nhận diện đúng sai và dịch ngôn ngữ ký hiệu.

### Algo Tournament

- Purpose: algorithm competition management system
- Repository: https://github.com/alotritne/AlgoTournament

### Other projects

- Weather App: https://github.com/alotritne/weatherApp
- Brat Generator: https://github.com/alotritne/Brat_Generator
- NetTruyen Downloader: https://github.com/alotritne/NetTruyen-Downloader

## Content rules

- Use concise, specific language and avoid inflated marketing claims.
- Show evidence of engineering ability through concrete project details.
- Avoid generic phrases such as "passionate developer" unless supported by meaningful context.
- Do not describe student projects as commercial production systems.
- Do not claim team ownership when personal contribution is unknown.
- Keep calls to action relevant to internships, fresher roles, and freelance work.
- Use the verified email and links in this file.

## Component and data organization

- Store repeated navigation, skills, social links, projects, and translations as structured data.
- Use reusable components for repeated project cards, badges, section headings, links, and controls.
- Keep components focused; split them when they have distinct responsibilities, not merely to reduce line count.
- Use types or schemas for content objects in TypeScript.
- Keep locale keys consistent and fail visibly during development when a translation is missing.
- Avoid premature global state; local state or context is sufficient for language preference unless requirements expand.

## Validation before completion

After making changes:

1. Run the project's existing lint, type-check, test, and production-build commands when available.
2. Check desktop and mobile layouts.
3. Test the Vietnamese/English switch and browser-language fallback.
4. Verify all navigation, email, repository, and social links.
5. Check keyboard navigation and visible focus.
6. Check reduced-motion behavior.
7. Review the page for fabricated or unsupported claims.
8. Report what changed, what was validated, and any missing user-provided information.

Do not publish, deploy, change domains, alter access settings, or contact anyone unless the user explicitly requests that action.
