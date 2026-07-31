# Nguyễn Ngọc Minh Triết — Portfolio

Portfolio cá nhân giới thiệu định hướng phát triển phần mềm, kỹ năng kỹ thuật và các dự án của Nguyễn Ngọc Minh Triết.

## Tính năng

- Giao diện responsive, dark-mode first.
- Nội dung tiếng Việt và tiếng Anh, tự nhận diện ngôn ngữ trình duyệt.
- Ghi nhớ lựa chọn ngôn ngữ trên thiết bị.
- Hero với hiệu ứng typing luân phiên các định hướng kỹ thuật.
- Terminal tương tác hỗ trợ các lệnh `help`, `about`, `skills`, `projects`, `contact` và `clear`.
- Danh sách kỹ năng được nhóm theo từng lĩnh vực.
- Dự án được trình bày theo bài toán, cách tiếp cận kỹ thuật, tính năng và công nghệ.
- Hiệu ứng ánh sáng theo con trỏ, có điều chỉnh theo nền sáng và tối.
- Hỗ trợ bàn phím, focus state và `prefers-reduced-motion`.

## Công nghệ

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- Motion
- Lucide React

## Chạy dự án

Yêu cầu Node.js và npm.

```bash
npm install
npm run dev
```

Vite sẽ hiển thị địa chỉ phát triển trong terminal, thường là `http://localhost:5173`.

## Các lệnh

```bash
npm run dev      # Chạy môi trường phát triển
npm run lint     # Kiểm tra ESLint
npm run build    # Kiểm tra TypeScript và tạo production build
npm run preview  # Xem thử production build trên máy
```

## Cấu trúc chính

```text
portfolio/
├── public/                  # Tài nguyên tĩnh và favicon
├── src/
│   ├── components/          # Các component giao diện
│   ├── styles/              # Style toàn cục
│   ├── App.tsx              # Bố cục trang chính
│   ├── data.ts              # Hồ sơ, kỹ năng, dự án và bản dịch
│   ├── main.tsx             # Điểm khởi tạo React
│   └── types.ts             # Kiểu dữ liệu dùng chung
├── index.html
├── tokens.css               # Design tokens
└── vite.config.ts
```

Thông tin cá nhân, liên hệ, kỹ năng và dự án được quản lý tập trung trong `src/data.ts` để giao diện chính và terminal luôn đồng bộ.

## Production build

```bash
npm run build
```

Kết quả được tạo trong thư mục `dist/`.

## Deploy trên Render

Tạo một **Static Site** và sử dụng:

| Thiết lập | Giá trị |
| --- | --- |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Root Directory | Để trống |

Render có thể tự động triển khai lại mỗi khi repository nhận commit mới trên nhánh đã chọn.

## Nội dung và dữ liệu

Thông tin trong portfolio chỉ sử dụng dữ liệu đã được xác minh. Không thêm kinh nghiệm, thành tích, số liệu hoặc liên kết dự án khi chưa có nguồn xác nhận.

## Liên hệ

- Website: [mtriet.is-a.dev](https://mtriet.is-a.dev/)
- Email: [mtri3t.dev@gmail.com](mailto:mtri3t.dev@gmail.com)
- GitHub: [alotritne](https://github.com/alotritne)
- Facebook: [alotritne](https://www.facebook.com/alotritne/)

