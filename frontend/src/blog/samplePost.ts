import type { BlogPost, BlogSummary, Locale } from '../types'

export const samplePost: BlogPost = {
  id: 'sample-portfolio-content-system',
  slug: 'xay-dung-portfolio-thanh-he-thong-noi-dung',
  title: {
    vi: 'Từ một trang portfolio đến hệ thống nội dung có thể mở rộng',
    en: 'From a portfolio page to an extensible content system',
  },
  excerpt: {
    vi: 'Những quyết định kỹ thuật khi bổ sung trang dự án, blog song ngữ, trình soạn thảo và API quản trị cho portfolio cá nhân.',
    en: 'Technical decisions behind adding project catalogs, a bilingual blog, a rich text editor, and an administration API to a personal portfolio.',
  },
  content: {
    vi: `<p>Phiên bản đầu tiên của portfolio tập trung vào một trang giới thiệu duy nhất. Cách làm này phù hợp khi nội dung còn ít, nhưng trở nên khó mở rộng khi cần trình bày nhiều dự án và viết bài kỹ thuật thường xuyên.</p>
      <h2>Bài toán cần giải quyết</h2>
      <p>Mục tiêu của lần nâng cấp là giữ trang chủ gọn, đồng thời tạo không gian riêng cho dự án và bài viết. Nội dung cần hỗ trợ tiếng Việt và tiếng Anh, hoạt động tốt trên thiết bị di động và không phụ thuộc hoàn toàn vào API khi dịch vụ tạm thời gián đoạn.</p>
      <h2>Cách tổ chức hệ thống</h2>
      <p>Frontend sử dụng React và TypeScript, tách phần điều hướng, thẻ dự án, danh sách bài viết và hiệu ứng xuất hiện thành các component dùng chung. Backend Express cung cấp REST API cho bài viết và dự án; MongoDB lưu nội dung động.</p>
      <ul><li>Trang <code>/projects</code> hỗ trợ tìm kiếm và lọc theo công nghệ.</li><li>Trang <code>/blog</code> hỗ trợ tìm kiếm, lọc tag và phân trang.</li><li>Trình soạn thảo Tiptap hỗ trợ bản nháp, xem trước và xuất bản song ngữ.</li><li>Nội dung HTML được lọc ở backend và tiếp tục được làm sạch khi hiển thị.</li></ul>
      <h2>Bài học rút ra</h2>
      <p>Việc tách nội dung khỏi phần trình bày giúp portfolio dễ bảo trì hơn. Chuyển động chỉ nên hỗ trợ định hướng và phản hồi; các hiệu ứng trang trí không phục vụ nội dung cần được loại bỏ. Cuối cùng, mỗi thay đổi phải được kiểm tra bằng lint, build, test API và quan sát ở nhiều kích thước màn hình.</p>`,
    en: `<p>The first version of the portfolio focused on a single introduction page. That worked while the content was small, but it became difficult to extend when more projects and technical articles were needed.</p>
      <h2>The problem</h2>
      <p>The goal was to keep the home page focused while giving projects and articles their own spaces. Content needed to support Vietnamese and English, work well on mobile devices, and retain useful fallback behavior when the API was temporarily unavailable.</p>
      <h2>System structure</h2>
      <p>The frontend uses React and TypeScript, with shared components for navigation, project cards, article lists, and content transitions. An Express backend exposes REST APIs for projects and posts, while MongoDB stores dynamic content.</p>
      <ul><li><code>/projects</code> supports search and technology filters.</li><li><code>/blog</code> supports search, tag filters, and pagination.</li><li>The Tiptap editor supports drafts, previews, and bilingual publishing.</li><li>HTML is sanitized on the backend and cleaned again before rendering.</li></ul>
      <h2>What I learned</h2>
      <p>Separating content from presentation makes the portfolio easier to maintain. Motion should support orientation and feedback, while decoration that does not help the content should be removed. Every change still needs verification through linting, production builds, API tests, and responsive browser checks.</p>`,
  },
  tags: ['React', 'Node.js', 'Kiến trúc'],
  published: true,
  publishedAt: '2026-10-22T00:00:00.000Z',
  createdAt: '2026-10-22T00:00:00.000Z',
  updatedAt: '2026-10-22T00:00:00.000Z',
}

const { content: sampleContent, ...summary } = samplePost
void sampleContent
export const sampleSummary: BlogSummary = summary

export function filterSample(query: string, tag: string, locale: Locale) {
  const matchesTag = !tag || samplePost.tags.includes(tag)
  const haystack = `${samplePost.title[locale]} ${samplePost.excerpt[locale]} ${samplePost.tags.join(' ')}`.toLocaleLowerCase(locale)
  return matchesTag && (!query || haystack.includes(query.toLocaleLowerCase(locale)))
}
