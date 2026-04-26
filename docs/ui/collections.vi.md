# Giao diện Bộ sưu tập

## Các tuyến đường đặc biệt

### /collections/all
Tuyến đường `/collections/all` là một bộ sưu tập ảo đặc biệt hiển thị tất cả các sản phẩm đang hoạt động trên toàn bộ cửa hàng.

- **Hành vi**: Nó không yêu cầu bản ghi tương ứng trong bảng `collections`.
- **Lọc**: Hỗ trợ tất cả các bộ lọc sản phẩm và sắp xếp tiêu chuẩn.
- **SEO**: Tự động tạo siêu dữ liệu với tiêu đề "Tất cả sản phẩm".

## Các Slug đã đặt trước

Các slug sau đây được đặt trước và không thể sử dụng khi tạo hoặc chỉnh sửa bộ sưu tập:

- `all`: Được đặt trước cho bộ sưu tập ảo "Tất cả sản phẩm".

Các bước xác minh thủ công cho slug `all`:
1. Truy cập Admin > Bộ sưu tập.
2. Cố gắng tạo một bộ sưu tập với slug `all`.
3. Xác minh rằng hệ thống ngăn chặn việc lưu và hiển thị lỗi xác thực: "Slug 'all' đã được đặt trước".
