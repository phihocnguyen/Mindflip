# Mindflip Frontend

Hệ thống đăng ký và đăng nhập được xây dựng với Next.js 15, TypeScript và Tailwind CSS.

## Tính năng

- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với email và mật khẩu
- ✅ Quản lý trạng thái authentication
- ✅ Giao diện responsive và thân thiện
- ✅ Validation form phía client
- ✅ Xử lý lỗi và thông báo
- ✅ Navigation component
- ✅ API routes để proxy requests đến backend

## Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/auth/
│   │   │   ├── login/route.ts      # API route đăng nhập
│   │   │   └── register/route.ts   # API route đăng ký
│   │   ├── login/
│   │   │   └── page.tsx            # Trang đăng nhập
│   │   ├── register/
│   │   │   └── page.tsx            # Trang đăng ký
│   │   ├── layout.tsx              # Layout chính
│   │   ├── page.tsx                # Trang chủ
│   │   └── globals.css             # CSS toàn cục
│   ├── components/
│   │   └── Navigation.tsx          # Component navigation
│   └── hooks/
│       └── useAuth.ts              # Custom hook quản lý auth
├── public/
│   └── favicon.svg                 # Favicon tùy chỉnh
└── package.json                    # Dependencies tối ưu
```

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Mở trình duyệt và truy cập [http://localhost:3001](http://localhost:3001)

## API Endpoints

### Đăng ký
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Đăng nhập
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Cấu hình Backend

Đảm bảo backend NestJS đang chạy trên port 3000 và có các endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`

## Tính năng bảo mật

- Validation email và mật khẩu phía client
- Mật khẩu tối thiểu 6 ký tự
- Xác nhận mật khẩu khi đăng ký
- Lưu trữ JWT token trong localStorage
- Xử lý lỗi và thông báo rõ ràng

## Công nghệ sử dụng

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management
- **Next.js API Routes** - Backend API

## Dependencies tối ưu

Dự án đã được tối ưu hóa với chỉ những dependencies cần thiết:
- `next`, `react`, `react-dom` - Core framework
- `typescript` - Type safety
- `tailwindcss` - Styling
- `eslint` - Code quality

## Hướng dẫn sử dụng

1. **Đăng ký**: Truy cập `/register` để tạo tài khoản mới
2. **Đăng nhập**: Truy cập `/login` để đăng nhập
3. **Navigation**: Sử dụng navigation bar để điều hướng
4. **Đăng xuất**: Nhấn nút "Đăng xuất" trong navigation

## Development

Để phát triển thêm tính năng:

1. Tạo component mới trong `src/components/`
2. Tạo hooks mới trong `src/hooks/`
3. Tạo API routes mới trong `src/app/api/`
4. Tạo trang mới trong `src/app/`

## Build và Deploy

```bash
# Build production
npm run build

# Start production server
npm start
```

## Dọn dẹp

Dự án đã được dọn dẹp:
- ✅ Xóa các file SVG không sử dụng
- ✅ Tạo favicon tùy chỉnh cho Mindflip
- ✅ Loại bỏ dependencies không cần thiết
- ✅ Tối ưu hóa cấu trúc thư mục
