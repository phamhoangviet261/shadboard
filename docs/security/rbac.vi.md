# Hệ thống Kiểm soát Truy cập dựa trên Vai trò (RBAC)

Tài liệu này mô tả hệ thống phân quyền cho bảng điều khiển quản trị Lensora.

## Các vai trò

Hệ thống hỗ trợ bốn vai trò riêng biệt:

1.  **Quản trị viên (Admin)**: Toàn quyền truy cập tất cả các tính năng. Có thể quản lý người dùng và vai trò.
2.  **Quản lý (Manager)**: Toàn quyền quản lý danh mục và sản phẩm. Có thể điều chỉnh kho hàng và xem phân tích.
3.  **Biên tập viên (Editor)**: Có thể xem và chỉnh sửa sản phẩm/bộ sưu tập nhưng không thể xóa hoặc điều chỉnh kho hàng.
4.  **Người xem (Viewer)**: Chỉ có quyền xem sản phẩm và bộ sưu tập. Không thể truy cập phân tích hoặc nhật ký hoạt động.

## Phân bổ Quyền hạn

| Quyền hạn | Admin | Manager | Editor | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Sản phẩm** | | | | |
| `products:view` | ✅ | ✅ | ✅ | ✅ |
| `products:create` | ✅ | ✅ | ✅ | ❌ |
| `products:update` | ✅ | ✅ | ✅ | ❌ |
| `products:delete` | ✅ | ✅ | ❌ | ❌ |
| `products:duplicate` | ✅ | ✅ | ✅ | ❌ |
| `products:bulk-update` | ✅ | ✅ | ❌ | ❌ |
| **Bộ sưu tập** | | | | |
| `collections:manage` | ✅ | ✅ | ✅ | ❌ |
| **Kho hàng** | | | | |
| `inventory:view` | ✅ | ✅ | ✅ | ✅ |
| `inventory:adjust` | ✅ | ✅ | ❌ | ❌ |
| **Hệ thống** | | | | |
| `analytics:view` | ✅ | ✅ | ❌ | ❌ |
| `activity-logs:view` | ✅ | ❌ | ❌ | ❌ |
| `aiContent:generate` | ✅ | ✅ | ✅ | ❌ |

## Triển khai Bảo mật

### Backend (Phía máy chủ)
Các API route được bảo mật bằng hàm `authenticateUser(requiredPermission)`. Các yêu cầu không được phép sẽ trả về trạng thái `403 Forbidden`.

### Frontend (Phía khách hàng)
Giao diện người dùng được bảo vệ bằng hook `usePermission`. Các nút chức năng bị hạn chế sẽ bị ẩn hoặc vô hiệu hóa, và việc điều hướng trực tiếp đến các trang không được phép sẽ bị chặn bởi thành phần `UnauthorizedState`.

## Nhật ký Hoạt động (Audit Logs)
Mọi hành động quản trị đều được ghi lại với trường `actorRole`, đảm bảo khả năng kiểm tra đầy đủ về người đã thực hiện hành động nào và dưới vai trò nào.

## Tài khoản Kiểm thử (Phát triển)

> [!WARNING]
> Những tài khoản này chỉ dành cho mục đích **kiểm thử cục bộ/phát triển**. Tuyệt đối không sử dụng trong môi trường sản xuất (production).

### Thông tin Đăng nhập

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Admin** | `admin@vietpham.com` | `Admin@123456` |
| **Manager** | `manager@vietpham.com` | `Manager@123456` |
| **Editor** | `editor@vietpham.com` | `Editor@123456` |
| **Viewer** | `viewer@vietpham.com` | `Viewer@123456` |

### Khởi tạo Dữ liệu (Seeding)

Để thêm hoặc cập nhật các tài khoản kiểm thử này vào cơ sở dữ liệu cục bộ của bạn, hãy chạy lệnh:

```bash
pnpm db:seed
```

Lệnh này sử dụng `prisma/seed.ts` để băm mật khẩu bảo mật và cập nhật (upsert) hồ sơ người dùng.

## Hướng dẫn Kiểm tra Thủ công

1.  **Chạy lệnh seed**: `pnpm db:seed`
2.  **Đăng nhập**: Sử dụng thông tin đăng nhập ở trên tại màn hình đăng nhập.
3.  **Kiểm tra Quyền hạn**:
    - Với vai trò **Viewer**, thử truy cập trang "Phân tích" (Analytics) (sẽ bị chặn).
    - Với vai trò **Editor**, thử xóa một sản phẩm (nút xóa sẽ bị ẩn hoặc vô hiệu hóa).
    - Với vai trò **Manager**, thử điều chỉnh kho hàng trong tab Inventory.
    - Với vai trò **Admin**, xác nhận toàn quyền truy cập nhật ký và cài đặt.
