# Tài liệu API Bộ sưu tập

Quản lý các bộ sưu tập sản phẩm trong Lensora.

## Các Endpoint

### Danh sách Bộ sưu tập
`GET /api/collections`

Lấy danh sách các bộ sưu tập với bộ lọc.

**Tham số Truy vấn (Query Parameters):**
- `status` (string): lọc theo trạng thái (`draft`, `published`, `archived`).
- `q` (string): từ khóa tìm kiếm.
- `includeProductCount` (boolean): nếu là true, sẽ bao gồm số lượng sản phẩm (`_count`) trong mỗi bộ sưu tập.
- `sortBy` (string): trường sắp xếp (`name`, `sortOrder`, `createdAt`).
- `sortOrder` (string): hướng sắp xếp (`asc`, `desc`).

**Ví dụ Request:**
`GET /api/collections?includeProductCount=true&sortBy=sortOrder`

---

### Chi tiết Bộ sưu tập
`GET /api/collections/[id]`

Lấy thông tin một bộ sưu tập theo ID hoặc slug.

---

### Cập nhật Bộ sưu tập
`PATCH /api/collections/[id]`

Cập nhật thông tin bộ sưu tập.

---

### Xóa Bộ sưu tập (Xóa mềm)
`DELETE /api/collections/[id]`

Đánh dấu bộ sưu tập đã bị xóa.

---

## Phản hồi Lỗi
- Tương tự như API Sản phẩm.
