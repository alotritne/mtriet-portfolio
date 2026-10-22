export function databaseErrorMessage(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined
  const message = error instanceof Error ? error.message : ''
  if (code === 18 || /authentication failed|bad auth/i.test(message)) {
    return 'MongoDB từ chối thông tin đăng nhập. Kiểm tra database user và mật khẩu trong MONGODB_URI (backend/.env), đúng cluster và authSource. Với Atlas, dùng database user, không dùng tài khoản đăng nhập website Atlas. Sau khi sửa .env, chạy npm run db:check rồi khởi động lại npm run dev.'
  }
  // Driver errors can contain connection details; never echo raw errors or the URI.
  return 'Không thể khởi tạo MongoDB. Kiểm tra MONGODB_URI, kết nối mạng, danh sách IP được phép và quyền của database user. Chạy npm run db:check để kiểm tra kết nối riêng.'
}
