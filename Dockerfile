# Sử dụng Node.js LTS làm base image
FROM node:20-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng cho production
RUN npm run build

# Sử dụng nginx để phục vụ các file tĩnh
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]
