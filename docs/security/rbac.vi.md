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
