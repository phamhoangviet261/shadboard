# Giao diện Quản lý Bộ sưu tập

Module Quản lý Bộ sưu tập cho phép quản trị viên tuyển chọn và tổ chức các sản phẩm vào các chủ đề trên cửa hàng.

## Tính năng

### Danh sách Bộ sưu tập
- **Tổng quan thời gian thực**: Liệt kê tất cả các bộ sưu tập với hình ảnh bìa và trạng thái xuất bản.
- **Số lượng sản phẩm**: Tự động hiển thị số lượng sản phẩm đang hoạt động được gán cho mỗi bộ sưu tập.
- **Tìm kiếm**: Lọc nhanh các bộ sưu tập theo tên hoặc slug.
- **Hành động**: Liên kết trực tiếp để chỉnh sửa bộ sưu tập hoặc xem trên cửa hàng.

### Quản lý Bộ sưu tập (Sheet)
- **Chỉnh sửa trực tiếp**: Tạo và chỉnh sửa các bộ sưu tập trong một bảng trượt (sheet) để quy trình làm việc nhanh hơn.
- **Xác thực biểu mẫu**: Xác thực nghiêm ngặt các trường bắt buộc như Tên và Slug.
- **Hình ảnh**: Hỗ trợ thiết lập hình ảnh bìa bộ sưu tập thông qua URL.
- **Quản lý trạng thái**: Kiểm soát khả năng hiển thị với các trạng thái Nháp, Đã xuất bản và Lưu trữ.

## Thành phần (Components)

- `CollectionManager`: Thành phần bảng điều khiển chính xử lý danh sách và bảng quản lý.

## Tích hợp API

- `GET /api/collections`: Lấy tất cả các bộ sưu tập đang hoạt động với số lượng sản phẩm.
- `POST /api/collections`: Tạo bộ sưu tập mới.
- `PATCH /api/collections/[id]`: Cập nhật chi tiết hoặc trạng thái bộ sưu tập.
- `DELETE /api/collections/[id]`: Xóa mềm bộ sưu tập.
