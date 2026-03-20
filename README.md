# Lens SEO Content Specialist - AI Final Project

## Giới thiệu dự án
Đây là ứng dụng hỗ trợ viết nội dung chuẩn SEO cho sản phẩm kính áp tròng (lens mắt), tích hợp công nghệ AI từ Google Gemini. Ứng dụng giúp người dùng phân tích sản phẩm, tìm kiếm từ khóa tối ưu và tạo bài viết mẫu chuyên nghiệp dựa trên các nguồn tin cậy.

## Công nghệ sử dụng
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **AI Integration**: Google Gemini API (@google/genai)
- **Deployment**: Vercel

## Các tính năng chính
1. **Phân tích sản phẩm**: Nhận diện đặc điểm, phân khúc và USP của lens.
2. **Bộ từ khóa SEO**: Đề xuất từ khóa chính, từ khóa dài và LSI keywords.
3. **Phân tích nguồn tin**: Tham chiếu thông tin từ các hãng lens và hiệp hội nhãn khoa uy tín.
4. **Tối ưu hóa hình ảnh**: Hỗ trợ tải ảnh để AI mô tả chi tiết hơn về sản phẩm.
5. **Nội dung mẫu**: Tạo bài viết chuẩn SEO với cấu trúc H1, H2, H3 và Meta Description.

## Hướng dẫn cài đặt và chạy local
1. Clone repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Tạo file `.env` và thêm API Key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Chạy ứng dụng:
   ```bash
   npm run dev
   ```

## Lưu ý về Bảo mật (API Key)
Trong đồ án này, vì mục đích trình bày và kiểm tra nhanh, API Key có thể được sử dụng trực tiếp ở phía Client-side. **Tuy nhiên, đây là cách làm không an toàn cho môi trường thực tế chuyên nghiệp.** Trong thực tế, API Key nên được quản lý ở phía Server-side (Backend) để tránh bị lộ thông tin nhạy cảm.

## Triển khai (Deployment)
Dự án được cấu hình để triển khai dễ dàng lên **Vercel**. Bạn chỉ cần kết nối GitHub repository với Vercel và thiết lập Environment Variable `VITE_GEMINI_API_KEY`.

---
*Dự án được thực hiện cho bài tập cuối kỳ môn Phát triển ứng dụng AI.*
