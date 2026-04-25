# Tài liệu API Sản phẩm

Quản lý sản phẩm mắt kính trong Lensora.

## Các Endpoint

### Danh sách Sản phẩm
`GET /api/products`

Lấy danh sách sản phẩm có phân trang, bộ lọc và sắp xếp.

**Tham số Truy vấn (Query Parameters):**
- `page` (number): Số trang (mặc định: 1).
- `limit` (number): Số lượng mỗi trang (mặc định: 10).
- `q` (string): Từ khóa tìm kiếm (theo tên, slug, sku, mô tả).
- `status` (string): Lọc theo trạng thái (`draft`, `published`, `archived`).
- `collectionId` (uuid): Lọc theo bộ sưu tập.
- `minPrice` (number): Giá tối thiểu.
- `maxPrice` (number): Giá tối đa.
- `tags` (string): Danh sách tag (ngăn cách bởi dấu phẩy).
- `sortBy` (string): Trường sắp xếp (`name`, `price`, `createdAt`, `stockQuantity`).
- `sortOrder` (string): Hướng sắp xếp (`asc`, `desc`).

**Ví dụ Request:**
`GET /api/products?status=published&sortBy=price&sortOrder=desc`

**Ví dụ Response:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Solaris Round",
      "slug": "solaris-round",
      "price": 189.00,
      "status": "published",
      "collection": {
        "name": "Summer Edit",
        "slug": "summer-edit"
      },
      ...
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### Chi tiết Sản phẩm
`GET /api/products/[id]`

Lấy thông tin một sản phẩm theo ID hoặc slug.

**Ví dụ Request:**
`GET /api/products/solaris-round`

---

### Cập nhật Sản phẩm
`PATCH /api/products/[id]`

Cập nhật một hoặc nhiều trường của sản phẩm.

**Request Body:**
Đối tượng sản phẩm (một phần).

**Ví dụ Request:**
`PATCH /api/products/[uuid]`
```json
{
  "price": 199.00,
  "status": "published"
}
```

---

### Nhân bản Sản phẩm
`POST /api/products/[id]/duplicate`

Tạo một sản phẩm nháp mới dựa trên một sản phẩm hiện có.

**Hành vi:**
- Sao chép tất cả các trường có thể chỉnh sửa (tên, mô tả, giá, thông số kỹ thuật, màu sắc, v.v.).
- Thêm hậu tố " Copy" vào tên sản phẩm.
- Tự động tạo slug và SKU duy nhất.
- Đặt trạng thái thành `draft` (nháp).
- Các trường được bảo vệ như `id`, `createdAt`, và `updatedAt` sẽ không được sao chép.

**Ví dụ Request:**
`POST /api/products/[uuid]/duplicate`

**Ví dụ Response:**
Trả về đối tượng sản phẩm mới được tạo với trạng thái `201 Created`.

---

### Xóa Sản phẩm (Xóa mềm)
`DELETE /api/products/[id]`

Đánh dấu sản phẩm đã bị xóa. Sản phẩm sẽ không còn xuất hiện trong các truy vấn danh sách/chi tiết thông thường.

---

## Phản hồi Lỗi

- `400 Bad Request`: Lỗi xác thực dữ liệu (ví dụ: giá không hợp lệ, thiếu tên).
- `404 Not Found`: Không tìm thấy sản phẩm hoặc đã bị xóa.
- `409 Conflict`: Vi phạm ràng buộc duy nhất (ví dụ: slug đã tồn tại).
- `500 Internal Server Error`: Lỗi hệ thống.

## Lưu ý về Xóa mềm (Soft Delete)
Lensora sử dụng cơ chế xóa mềm cho sản phẩm và bộ sưu tập. Các bản ghi bị xóa vẫn nằm trong cơ sở dữ liệu với mốc thời gian `deletedAt` nhưng sẽ bị lọc bỏ khỏi tất cả các phản hồi API theo mặc định.
