Mindflip
========

Mindflip là một nền tảng học từ vựng hiện đại giúp người dùng ghi nhớ và làm chủ từ mới hiệu quả thông qua phương pháp lặp lại ngắt quãng và flashcard tương tác. Ứng dụng được xây dựng với frontend Next.js 15 và backend NestJS, cung cấp trải nghiệm học tập toàn diện với tính năng theo dõi tiến trình và phân tích dữ liệu.

🌟 Tổng quan
------------

Mindflip là nền tảng học từ vựng thông minh được thiết kế để giúp người dùng ghi nhớ và làm chủ từ mới hiệu quả dựa trên các kỹ thuật học tập khoa học. Ứng dụng kết hợp flashcard tương tác với thuật toán lặp lại ngắt quãng (SRS) nhằm tối ưu hóa khả năng ghi nhớ lâu dài, đồng thời cung cấp tính năng theo dõi tiến trình và phân tích toàn diện.

Với giao diện sạch sẽ, phản hồi nhanh và lộ trình học cá nhân hóa, Mindflip giúp việc học từ vựng trở nên hấp dẫn và hiệu quả cho mọi cấp độ người học.

🏗️ Kiến trúc
-------------

*   **Frontend**: Next.js 15 với App Router, TypeScript, Tailwind CSS
    
*   **Backend**: NestJS với kiến trúc module và MongoDB/Mongoose
    
*   **Xác thực**: JWT-based authentication với Passport.js và Google OAuth
    
*   **Giao tiếp API**: RESTful API với tài liệu Swagger
    
*   **Quản lý trạng thái**: Zustand cho frontend state management
    
*   **Trực quan dữ liệu**: Recharts cho phân tích và theo dõi tiến trình
    
*   **Triển khai**: Sẵn sàng triển khai trên Vercel (frontend) và nền tảng cloud (backend)
    

🚀 Tính năng chính
------------------

### 📚 Quản lý từ vựng

*   **Tạo bộ từ vựng tùy chỉnh**: Tự xây dựng bộ từ vựng với thuật ngữ và định nghĩa
    
*   **Nhập/Xuất**: Dễ dàng nhập từ nguồn bên ngoài hoặc xuất bộ từ vựng
    
*   **Chia sẻ công khai/riêng tư**: Chia sẻ bộ từ vựng với cộng đồng hoặc giữ riêng
    
*   **Hỗ trợ đa phương tiện**: Thêm hình ảnh, âm thanh và ví dụ để nâng cao trải nghiệm
    

### 🧠 Hệ thống học thông minh

*   **Lặp lại ngắt quãng**: Thuật toán SRS tối ưu thời điểm ôn tập để ghi nhớ lâu dài
    
*   **Flashcard thích ứng**: Thẻ học tương tác với hiệu ứng lật và phát âm thanh
    
*   **Độ khó tiến triển**: Thích ứng với tốc độ và trình độ người học
    
*   **Nhiều chế độ học**: Flashcard, quiz, trò chơi ghép từ, bài tập viết
    

### 📊 Phân tích & Thống kê

*   **Bảng điều khiển học tập**: Tổng quan tiến trình học và thành tựu
    
*   **Theo dõi hoạt động**: Thống kê thời gian học, số từ đã làm chủ, thói quen học tập
    
*   **Chỉ số hiệu suất**: Biểu đồ thể hiện phân bố kỹ năng và tiến trình làm chủ từ vựng
    
*   **Lịch nhiệt (Heatmap)**: Theo dõi hoạt động học hàng ngày và streak
    

### 🔐 Xác thực & Bảo mật

*   **Đăng nhập/Đăng ký an toàn**: JWT-based với mật khẩu được mã hóa
    
*   **Google OAuth**: Đăng nhập nhanh với tài khoản Google
    
*   **Xác minh email**: Bảo mật xác nhận email cho tài khoản mới
    
*   **Quản lý phiên**: Tự động làm mới token và xử lý phiên an toàn
    

### 🎨 Trải nghiệm người dùng

*   **Responsive**: Tối ưu cho desktop, tablet và mobile
    
*   **Chế độ tối/sáng**: Tuỳ chỉnh giao diện theo sở thích
    
*   **Điều hướng trực quan**: UI sạch sẽ, dễ sử dụng
    
*   **Phím tắt**: Điều hướng và thao tác nhanh bằng bàn phím
    

📁 Cấu trúc dự án
-----------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashSao chépChỉnh sửamindflip/  ├── backend/                    # Ứng dụng NestJS  │   ├── src/                    # Mã nguồn backend  │   │   ├── modules/            # Các module tính năng (auth, sets, users, ...)  │   │   ├── common/             # Tiện ích và interceptor chung  │   │   ├── config/              # Cấu hình ứng dụng  │   │   └── main.ts             # Entry point  │   ├── package.json            # Dependencies backend  │   └── ...  └── frontend/                   # Ứng dụng Next.js      ├── src/                    # Mã nguồn frontend      │   ├── app/                # App Router pages & layouts      │   │   ├── dashboard/      # Bảng điều khiển & phân tích      │   │   ├── sets/           # Quản lý bộ từ vựng      │   │   ├── login/          # Trang xác thực      │   │   └── ...      │   ├── components/         # UI components tái sử dụng      │   ├── hooks/              # Custom hooks      │   ├── libs/               # Thư viện & API clients      │   └── ...      ├── package.json            # Dependencies frontend      └── ...   `

🚀 Bắt đầu
----------

### Yêu cầu

*   Node.js (v18+)
    
*   MongoDB (local hoặc cloud)
    
*   npm hoặc yarn
    

### Cài đặt

1.  **Backend**:
    

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run start:dev   `

1.  **Frontend**:
    

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install  npm run dev   `

### Biến môi trường

Tạo .env trong cả backend và frontend với cấu hình phù hợp.

🔐 Luồng xác thực
-----------------

1.  Người dùng đăng ký qua /api/auth/register
    
2.  Backend xác thực và lưu người dùng với mật khẩu mã hóa
    
3.  Người dùng đăng nhập qua /api/auth/login
    
4.  Backend trả JWT token nếu thành công
    
5.  Frontend lưu token và gửi trong request tiếp theo
    
6.  Backend xác thực token với các route bảo vệ
    

🛠️ Công nghệ sử dụng
---------------------

### Backend

*   **NestJS** - Framework Node.js với kiến trúc module
    
*   **MongoDB/Mongoose** - Cơ sở dữ liệu NoSQL và ODM
    
*   **Passport.js** - Middleware xác thực đa chiến lược
    
*   **JWT** - Xác thực & phân quyền dựa trên token
    
*   **bcrypt.js** - Hash và kiểm tra mật khẩu
    
*   **Swagger** - Tài liệu API & giao diện test
    
*   **Jest** - Unit & integration testing
    
*   **Class Validator** - Xác thực & làm sạch dữ liệu
    

### Frontend

*   **Next.js 15** - Framework React với App Router
    
*   **TypeScript** - Kiểu tĩnh
    
*   **Tailwind CSS** - CSS tiện ích-first
    
*   **React Hooks** - State & effect
    
*   **Axios** - HTTP client
    
*   **Zustand** - State management nhẹ
    
*   **Lucide React** - Icon SVG
    
*   **Recharts** - Biểu đồ dựa trên D3
    
*   **React Markdown** - Render Markdown
    

📄 Giấy phép
------------

Dự án được cấp phép theo MIT License - xem LICENSE để biết thêm.
