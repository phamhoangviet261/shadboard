# Giao diện Quản lý Sản phẩm

Module Quản lý Sản phẩm cung cấp giao diện toàn diện để quản lý danh mục mắt kính của Lensora.

## Tính năng

### Danh sách Sản phẩm
- **Truy xuất dữ liệu phía Máy chủ**: Dữ liệu được lấy trực tiếp từ cơ sở dữ liệu, hỗ trợ phân trang và bộ lọc.
- **Tìm kiếm**: Tìm kiếm theo Tên, Slug hoặc SKU với cơ chế trì hoãn (debounce).
- **Bộ lọc**: Lọc sản phẩm theo Trạng thái (Nháp, Đã xuất bản, Lưu trữ) và Bộ sưu tập.
- **Phân trang**: Điều hướng qua danh mục lớn một cách dễ dàng.
- **Hành động**: Truy cập nhanh để xem chi tiết, chỉnh sửa, nhân bản hoặc xóa sản phẩm.
- **Nhân bản Sản phẩm**: Tạo một sản phẩm nháp mới từ sản phẩm hiện có chỉ với một cú nhấp chuột. Slug và SKU được tự động tạo lại để đảm bảo tính duy nhất.

### Chi tiết Sản phẩm
- **Chế độ xem toàn diện**: Hiển thị tất cả thông tin sản phẩm bao gồm các thông số kỹ thuật đặc thù của mắt kính.
- **Giá cả & Kho hàng**: Phân tích rõ ràng về giá, giá so sánh, giá vốn và mức tồn kho.
- **Thư viện ảnh**: Lưới hiển thị trực quan tất cả hình ảnh sản phẩm.
- **Tổ chức**: Hiển thị bộ sưu tập, thương hiệu và thẻ đã gán.

### Tạo/Chỉnh sửa Sản phẩm
- **Xác thực biểu mẫu**: Sử dụng `react-hook-form` và `zod` để đảm bảo an toàn kiểu dữ liệu và phản hồi người dùng.
- **Thông số Mắt kính**: Các trường chuyên biệt cho Hình dáng gọng, Chất liệu, Loại tròng, Độ vừa vặn khuôn mặt và Giới tính.
- **Kích thước**: Nhập chính xác chiều rộng Tròng, Cầu, Càng và Tổng chiều rộng.
- **Biến thể Màu sắc**: Thêm và xóa linh hoạt các biến thể màu với trình chọn màu.
- **SEO**: Tích hợp các trường cho tiêu đề và mô tả SEO.

## Thành phần (Components)

- `ProductManagementTable`: Thành phần danh sách cốt lõi với bộ lọc đồng bộ hóa URL.
- `ProductForm`: Biểu mẫu tập trung cho cả việc tạo và chỉnh sửa.
- `ProductDetailsActions`: Các trình xử lý phía client cho các tương tác trên trang chi tiết.
- `ProductDeleteDialog`: Hộp thoại xác nhận để lưu trữ sản phẩm an toàn.
- `ProductDuplicateDialog`: Hộp thoại xác nhận để nhân bản sản phẩm.

## Tích hợp API

- `GET /api/products`: Danh sách với các tham số truy vấn.
- `GET /api/products/[id]`: Truy xuất một sản phẩm.
- `POST /api/products`: Tạo sản phẩm mới.
- `POST /api/products/[id]/duplicate`: Nhân bản sản phẩm hiện có.
- `PATCH /api/products/[id]`: Cập nhật sản phẩm.
- `DELETE /api/products/[id]`: Xóa mềm (lưu trữ).
