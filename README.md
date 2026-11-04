# Nguyễn Ngọc Minh Triết — Portfolio

Portfolio cá nhân giới thiệu định hướng phát triển phần mềm, kỹ năng kỹ thuật và các dự án của Nguyễn Ngọc Minh Triết. Repository gồm frontend công khai và backend quản trị dự án dùng MongoDB.

## Tính năng

- Giao diện responsive, dark-mode first.
- Nội dung tiếng Việt và tiếng Anh, tự nhận diện ngôn ngữ trình duyệt.
- Ghi nhớ lựa chọn ngôn ngữ trên thiết bị.
- Hero mới với quỹ đạo chuyển động, vai trò luân phiên và các liên kết khám phá dự án/liên hệ.
- Giao diện trang chủ thống nhất theo mẫu `portfolio-mtriet`: hero tối, marquee công nghệ, các dự án, 4 nhóm kỹ năng trên nền mint, và vòng tròn liên hệ biến dạng cả viền ngoài lẫn lõi trong.
- Danh sách kỹ năng chia thành bốn nhóm: Ngôn ngữ, Web & Backend, Data & Mobile, Công cụ.
- Dự án được trình bày theo bài toán, cách tiếp cận kỹ thuật, tính năng và công nghệ.
- Hiệu ứng ánh sáng theo con trỏ, có điều chỉnh theo nền sáng và tối.
- Hỗ trợ bàn phím, focus state và công tắc **Hiệu ứng: Bật/Tắt**; lựa chọn được lưu trong trình duyệt. Mặc định các hiệu ứng luôn chạy, kể cả khi Windows bật chế độ giảm chuyển động; người xem vẫn có thể chủ động tắt.
- Thanh công nghệ chạy vô hạn, logo thương hiệu từ `simple-icons` và hình vòng tròn có lớp ngoài/lõi trong biến đổi độc lập.
- Trang `/admin` để thêm, sửa, xóa dự án sau khi đăng nhập.
- Trang `/admin?view=site` để thay đổi hồ sơ, GPA, năm học, liên hệ, vai trò và thêm/xóa/sửa các nhóm kỹ năng trong MongoDB.
- Blog tại `/blog`, trang đọc riêng `/blog/:slug` và các bài mới nhất trên portfolio.
- Trang `/projects` liệt kê toàn bộ dự án, hỗ trợ tìm kiếm theo nội dung và lọc theo công nghệ; URL lưu lại bộ lọc để có thể chia sẻ.
- Trang `/blog` hỗ trợ tìm theo tiêu đề, mô tả hoặc chủ đề, lọc tag và phân trang 12 bài.
- Trình soạn thảo Tiptap trong `/admin?view=blog`: định dạng, bảng, ảnh qua URL, bản nháp, xem trước và xuất bản song ngữ.
- Thẻ dự án gọn với phần chi tiết mở rộng, biểu tượng kỹ năng, thanh tiến độ cuộn, hiệu ứng xuất hiện nội dung và chuyển vị trí khi lọc. Có thể tắt chuyển động bằng công tắc ở trang chủ.
- Access JWT ngắn hạn và refresh JWT xoay vòng bằng cookie `HttpOnly`.

## Công nghệ

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- Motion
- Lucide React
- Simple Icons (biểu tượng thương hiệu công nghệ)

Backend:

- Node.js và Express
- MongoDB
- JWT access/refresh rotation
- Zod
- bcrypt

## Chạy dự án

Yêu cầu Node.js và npm.

```bash
cd frontend
npm install
npm run dev
```

Vite sẽ hiển thị địa chỉ phát triển trong terminal, thường là `http://localhost:5173`.

Chạy backend ở terminal khác:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Trong môi trường phát triển, Vite proxy `/api` sang `http://localhost:3000`. Khi deploy, frontend đọc địa chỉ backend từ `VITE_API_URL`.

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
├── frontend/                # React, Vite và giao diện quản trị
│   ├── public/              # Tài nguyên tĩnh và favicon
│   ├── src/
│   │   ├── admin/           # Giao diện quản trị
│   │   ├── components/      # Các component portfolio
│   │   ├── lib/             # API client
│   │   ├── portfolio/       # Trang chủ theo mẫu: HTML, CSS, motion, CMS hydration
│   │   ├── styles/          # Style dành cho các trang admin/blog/projects
│   │   ├── App.tsx          # Trang chủ cùng dữ liệu CMS
│   │   ├── siteDefaults.ts  # Hồ sơ và bốn nhóm kỹ năng mặc định
│   │   └── data.ts          # Dữ liệu fallback và bản dịch
│   ├── index.html
│   ├── tokens.css           # Design tokens
│   └── vite.config.ts
├── backend/                 # Express API, MongoDB và JWT auth
└── render.yaml              # Blueprint cho hai service Render
```

Thông tin fallback, liên hệ và kỹ năng được khai báo trong `frontend/src/data.ts` và `frontend/src/siteDefaults.ts`. Khi đã lưu hồ sơ trong trang quản trị, website đọc từ MongoDB qua `GET /api/site/public`. Khi API chưa sẵn sàng hoặc chưa có hồ sơ lưu, giao diện dùng dữ liệu mặc định. Dự án và blog được quản lý bằng các API riêng.

## Quản lý nội dung trên website

1. Đăng nhập tại `/admin` bằng tài khoản quản trị đã tạo trong MongoDB.
2. Mục **Dự án**: thêm mới, sửa, xóa, chọn công khai/nổi bật hoặc nhập các dự án mặc định nếu database đang trống.
3. Mục **Blog** (`/admin?view=blog`): viết, sửa, lưu bản nháp, xuất bản, gỡ và xóa bài.
4. Mục **Hồ sơ & kỹ năng** (`/admin?view=site`): sửa thông tin sinh viên, liên kết, các vai trò; thêm/xóa nhóm kỹ năng và chỉnh danh sách công nghệ (mỗi dòng một mục); chọn **Lưu nội dung** để áp dụng.

Các đường dẫn API chính: `GET /api/site/public` là công khai; `GET /api/site` và `PUT /api/site` yêu cầu access token quản trị. CRUD dự án tại `/api/projects`, CRUD blog tại `/api/posts`. Không có endpoint công khai để sửa dữ liệu. Nếu API gặp lỗi kết nối, nội dung chưa được lưu sẽ không xuất hiện trên website.

## Production build

```bash
cd frontend
npm run build
```

Kết quả frontend được tạo trong thư mục `frontend/dist/`.

## Cấu hình backend

Không commit `.env`. Backend cần các biến:

```text
MONGODB_URI
MONGODB_DB
FRONTEND_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
```

Hai JWT secret phải khác nhau và có tối thiểu 32 ký tự. Có thể tạo secret bằng password manager hoặc công cụ sinh chuỗi ngẫu nhiên an toàn.

Tạo hoặc cập nhật tài khoản quản trị:

```bash
cd backend
set ADMIN_EMAIL=mtri3t.dev@gmail.com
set ADMIN_PASSWORD=mat-khau-dai-va-khong-trung-lap
npm run admin:create
```

Trong PowerShell dùng `$env:ADMIN_EMAIL` và `$env:ADMIN_PASSWORD` thay cho `set`. Chỉ giữ `ADMIN_PASSWORD` trong môi trường lúc chạy lệnh; không thêm mật khẩu vào repository.

## Cơ chế xác thực

Nếu backend báo `bad auth : authentication failed`, kiểm tra **Database Access** trên MongoDB Atlas: dùng đúng database user và mật khẩu của user đó, không phải tài khoản đăng nhập Atlas. Nếu quên mật khẩu, đặt lại trên Atlas và cập nhật `MONGODB_URI` trong `backend/.env` bằng chuỗi **Connect → Drivers** của đúng cluster. Mã hóa URL cho ký tự đặc biệt trong username/password; Atlas thường dùng `authSource=admin`. Không đưa URI hoặc mật khẩu vào Git hay nội dung chat.

Sau khi cập nhật, từ thư mục `backend` chạy `npm run db:check`. Lệnh chỉ ping database, không tạo index hoặc sửa dữ liệu. Khi báo thành công, dừng tiến trình cũ và chạy lại `npm run dev` (thay đổi `.env` có thể không kích hoạt watch).

- Access token hết hạn sau 15 phút và chỉ được giữ trong memory của frontend.
- Refresh token hết hạn sau 7 ngày, nằm trong cookie `HttpOnly` và được xoay sau mỗi lần sử dụng.
- Database chỉ lưu SHA-256 hash của refresh token.
- Khi phát hiện refresh token cũ bị dùng lại, toàn bộ token family bị thu hồi.
- Endpoint refresh/logout yêu cầu CSRF token và chỉ chấp nhận origin đã cấu hình.
- Không có endpoint đăng ký công khai.

## Viết và quản lý blog

1. Chạy frontend và backend với MongoDB đã cấu hình như hướng dẫn ở trên.
2. Đăng nhập `/admin`, chọn **Blog** → **Viết bài mới**.
3. Nhập tiêu đề, mô tả ngắn và nội dung. Chuyển tab **Tiếng Việt / English** để viết từng phiên bản; ứng dụng không tự dịch.
4. Dùng thanh công cụ để chèn tiêu đề, in đậm/nghiêng/gạch chân, danh sách, trích dẫn, khối mã, liên kết, ảnh HTTPS, bảng và căn lề. Chọn một ô trong bảng để thêm/xóa hàng hoặc cột.
5. Chọn **Lưu bản nháp** để ghi vào MongoDB. Bản nháp có thể chưa đủ hai ngôn ngữ và chỉ người quản trị đọc được.
6. Chọn **Xem trước** để xem nội dung; bật **Công khai sau khi lưu** và chọn **Lưu và xuất bản** khi đã hoàn tất cả hai ngôn ngữ.
7. Mở lại bài để chỉnh sửa, bỏ chọn công khai để gỡ bài khỏi blog hoặc xóa bài từ danh sách quản trị.

Bài viết lưu ở collection `posts`, với slug duy nhất và ngày xuất bản được giữ nguyên khi chỉnh sửa. Slug tạo tự động từ tiêu đề nếu để trống; đổi slug sẽ đổi đường dẫn bài viết. Danh sách công khai phân trang 12 bài/trang và không tải toàn bộ nội dung bài. Trình soạn thảo chỉ được tải khi mở màn hình viết, không nằm trong JavaScript ban đầu của portfolio.

Nút lưu là thao tác ghi lên máy chủ; chưa có tự động lưu. Màn hình cảnh báo khi đóng, rời trang hoặc đăng xuất khi còn thay đổi. Khi lưu thất bại, nội dung hiện tại vẫn nằm trong trình soạn thảo để thử lại. Ảnh sử dụng URL HTTPS, chưa có tải file lên máy chủ. Không có bài viết mẫu được đưa vào database thật.

HTML được lọc theo danh sách cho phép ở backend trước khi lưu, đồng thời được DOMPurify lọc khi hiển thị. Script, iframe, event handler và URL nguy hiểm không được giữ lại. API tạo/sửa/xóa bài và đọc bản nháp yêu cầu access token quản trị hiện có.

## Kiểm thử blog

```bash
cd backend
npm run lint
npm run build
npm test
```

`npm test` dùng MongoDB tạm độc lập qua `mongodb-memory-server`, không sử dụng database trong `.env`. Lần đầu có thể cần tải MongoDB binary. Các kiểm thử bao gồm lọc HTML, xác thực, kiểm tra song ngữ, trùng slug và vòng đời lưu nháp → xuất bản → đọc lại → sửa → gỡ công khai → xóa.

Để kiểm tra giao diện bằng dữ liệu tạm, chạy `npx tsx tests/dev-fixture.ts` trong `backend` thay cho server bình thường, rồi chạy Vite tại `http://localhost:5173`. Fixture chỉ lắng nghe trên localhost:3000 và dùng tài khoản **chỉ dành cho kiểm thử** `browser-test@example.test` / `local-browser-test-only`. Database này bị hủy khi dừng fixture; không dùng fixture để viết bài thật.

Giao diện đã được kiểm tra trên Chromium ở 320, 375, 414, 768 và 1280 px, bao gồm thao tác soạn thảo/lưu/xuất bản, xem trước, liên kết, VI/EN và ghi nhớ lựa chọn, fallback khi storage không khả dụng, điều hướng bàn phím, reduced motion, lỗi mạng và cảnh báo thay đổi chưa lưu.

## Deploy trên Render

File `render.yaml` tạo hai service:

1. `mtriet-portfolio`: Static Site cho React.
2. `mtriet-portfolio-api`: Web Service cho Express và MongoDB.

Khi tạo Blueprint, cung cấp:

- Frontend `VITE_API_URL`: URL public của backend. Nên dùng custom domain cùng site, ví dụ `https://api.mtriet.is-a.dev`.
- Backend `MONGODB_URI`: connection string MongoDB Atlas.
- Backend `FRONTEND_ORIGIN`: origin frontend, ví dụ `https://mtriet.is-a.dev`. Có thể khai báo nhiều origin cách nhau bằng dấu phẩy trong lúc chuyển domain.

`VITE_API_URL` được Vite nhúng vào JavaScript lúc **build**, nên nếu thay đổi domain API, cần build/deploy lại Static Site. Đặt `FRONTEND_ORIGIN` đúng các domain thực tế truy cập trang quản trị, không thêm đường dẫn. Render cần có biến `MONGODB_URI` hoạt động và JWT secrets riêng cho backend. Kiểm tra backend qua `https://api.mtriet.is-a.dev/api/health` (kết quả `{"status":"ok"}`).

Nên gắn backend với subdomain `api.mtriet.is-a.dev`. Frontend và backend cùng site giúp refresh cookie hoạt động ổn định hơn trên các trình duyệt hạn chế third-party cookie.

Cấu hình frontend thủ công tương đương:

| Thiết lập | Giá trị |
| --- | --- |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Root Directory | `frontend` |

Blueprint trong `render.yaml` khai báo `autoDeployTrigger: commit` cho cả hai service. Khi các service đã liên kết với repository GitHub trên Render, commit mới được push lên nhánh theo dõi sẽ tự kích hoạt build/deploy; kiểm tra **Events** và **Logs** của từng service để xác nhận kết quả.

Sau deploy backend, chạy script `admin:create` từ môi trường có quyền truy cập cùng MongoDB Atlas, sau đó đăng nhập tại `/admin`.

## Nội dung và dữ liệu

Thông tin trong portfolio chỉ sử dụng dữ liệu đã được xác minh. Không thêm kinh nghiệm, thành tích, số liệu hoặc liên kết dự án khi chưa có nguồn xác nhận.

## Liên hệ

- Website: [mtriet.is-a.dev](https://mtriet.is-a.dev/)
- Email: [mtri3t.dev@gmail.com](mailto:mtri3t.dev@gmail.com)
- GitHub: [alotritne](https://github.com/alotritne)
- Facebook: [alotritne](https://www.facebook.com/alotritne/)
