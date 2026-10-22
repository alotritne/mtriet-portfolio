export const projectCopy = {
  vi: {
    label: 'Dự án', title: 'Từ bài toán đến sản phẩm.', intro: 'Các dự án mình đã thực hiện trong quá trình học: backend, ứng dụng Android và nhận diện ngôn ngữ ký hiệu. Mỗi dự án là một cách tiếp cận khác nhau.',
    search: 'Tìm dự án', placeholder: 'Tên dự án, công nghệ hoặc bài toán…', technology: 'Công nghệ', all: 'Tất cả công nghệ', results: 'dự án',
    empty: 'Chưa có dự án phù hợp.', emptyBody: 'Thử một từ khóa khác hoặc bỏ bộ lọc công nghệ.', clear: 'Xóa bộ lọc',
    fallback: 'Đang hiển thị các dự án có sẵn. Chưa tải được cập nhật mới nhất.', retry: 'Tải lại', loading: 'Đang cập nhật dự án…',
    other: 'Các kho mã khác', otherBody: 'Một số dự án khác trên GitHub. Thông tin kỹ thuật chi tiết sẽ được bổ sung sau.', repo: 'Xem mã nguồn', allProjects: 'Tất cả dự án',
    next: 'Tiếp tục khám phá', blog: 'Ghi chép & chia sẻ', blogBody: 'Ghé blog để đọc những điều mình học được trong quá trình viết phần mềm.',
  },
  en: {
    label: 'Projects', title: 'From problem to product.', intro: 'Projects built while learning: backends, Android applications, and sign-language recognition. Each explores a different technical approach.',
    search: 'Find a project', placeholder: 'Project name, technology, or problem…', technology: 'Technology', all: 'All technologies', results: 'projects',
    empty: 'No matching projects.', emptyBody: 'Try another keyword or clear the technology filter.', clear: 'Clear filters',
    fallback: 'Showing the included projects. The latest updates could not be loaded.', retry: 'Try again', loading: 'Updating projects…',
    other: 'More repositories', otherBody: 'Other projects on GitHub. More technical details will be added later.', repo: 'View repository', allProjects: 'All projects',
    next: 'Keep exploring', blog: 'Notes & perspectives', blogBody: 'Visit the blog for things I learn while building software.',
  },
} as const

export const otherRepositories = [
  { name: 'Weather App', url: 'https://github.com/alotritne/weatherApp' },
  { name: 'Brat Generator', url: 'https://github.com/alotritne/Brat_Generator' },
  { name: 'NetTruyen Downloader', url: 'https://github.com/alotritne/NetTruyen-Downloader' },
]
