# Lensora Shop UI - Tính năng đã triển khai

Tài liệu này tóm tắt các phần giao diện đã được triển khai cho trải nghiệm mua sắm Lensora, bao gồm shop, sản phẩm và bộ sưu tập.

## Tổng quan

Lensora là giao diện ecommerce cho eyewear theo phong cách premium, tối giản và hiện đại. Các trang public shop dùng dữ liệu mock từ `src/data/lensora/`, tái sử dụng component trong `src/components/lensora/` và hỗ trợ route đa ngôn ngữ qua `/:lang`.

Các route chính:

- `/:lang/shop`
- `/:lang/shop/collections`
- `/:lang/shop/collections/:slug`
- `/:lang/shop/products/:slug`
- `/:lang/admin/products`
- `/:lang/admin/collections`

## Shop UI

### Trang shop chính

Route: `/:lang/shop`

Tính năng đã có:

- Hero section toàn màn hình với ảnh nền lớn, overlay tương phản và CTA rõ ràng.
- CTA dẫn tới danh sách collections.
- CTA dẫn tới sản phẩm nổi bật `Aether Titanium`.
- Khu vực sản phẩm nổi bật lấy từ `productsData` với điều kiện `isFeatured` và `published`.
- Grid sản phẩm responsive: 1 cột mobile, 2 cột tablet, 4 cột desktop.
- Khu vực "Shop by Collection" hiển thị các collection nổi bật.
- Brand strip giới thiệu các lợi ích:
  - Handcrafted
  - Prescription Ready
  - Free Returns
- Metadata SEO cho trang shop.

### Layout shop

Route layout: `src/app/[lang]/(public)/shop/layout.tsx`

Tính năng đã có:

- Storefront header riêng cho shop, tách khỏi dashboard sidebar.
- Logo Lensora với icon kính.
- Navigation desktop:
  - Shop
  - Collections
  - Admin
- Nút đổi theme sáng/tối dùng `ModeDropdown`.
- Footer đơn giản cho storefront.
- Hỗ trợ dictionary theo locale cho dropdown theme.

## Product UI

### Product card

Component: `src/components/lensora/product-card.tsx`

Tính năng đã có:

- Card sản phẩm có ảnh chính và ảnh hover.
- Hover scale ảnh mượt.
- Badge `Featured`.
- Badge giảm giá theo phần trăm khi có `compareAtPrice`.
- Giá hiện tại và giá gạch ngang.
- Hiển thị swatch màu.
- Hiển thị frame shape và material.
- Link tới trang chi tiết sản phẩm.
- Quick action overlay khi hover:
  - Quick View
  - Add to Bag
- Quick View mở dạng sheet.

### Quick view sản phẩm

Component: `src/components/lensora/product-quick-view.tsx`

Tính năng đã có:

- Sheet bên phải để xem nhanh sản phẩm.
- Gallery ảnh trong sheet.
- Nút chuyển ảnh trước/sau.
- Dot indicator cho nhiều ảnh.
- Tên sản phẩm, giá, giá sale và badge giảm giá.
- Mô tả rút gọn.
- Chọn màu bằng color swatch.
- Tóm tắt nhanh:
  - Shape
  - Material
  - Fit
- Nút `Add to Bag`.
- Link `View Full Details` tới trang chi tiết.

### Trang chi tiết sản phẩm

Route: `/:lang/shop/products/:slug`

Tính năng đã có:

- Static params cho các sản phẩm `published`.
- Metadata SEO theo `seoTitle` và `seoDescription` của sản phẩm.
- Trả về `notFound()` nếu sản phẩm không tồn tại hoặc không published.
- Layout 2 cột trên desktop:
  - Gallery bên trái.
  - Thông tin và form bên phải.
- Gallery sticky trên desktop.
- Badge `Featured`.
- Badge `Save X%` nếu đang sale.
- Tên sản phẩm, giá hiện tại, giá so sánh.
- Mô tả sản phẩm.
- Form chọn biến thể sản phẩm.
- Accordion thông số frame.
- Section sản phẩm liên quan cùng collection.

### Product gallery

Component: `src/app/[lang]/(public)/shop/products/[slug]/_components/product-gallery.tsx`

Tính năng đã có:

- Ảnh chính lớn theo tỉ lệ ổn định.
- Thumbnail danh sách ảnh.
- Chọn ảnh bằng thumbnail.
- Nút chuyển ảnh trước/sau.
- Hover reveal cho nút điều hướng trên desktop.
- Trạng thái thumbnail đang chọn bằng border/ring.

### Product details form

Component: `src/app/[lang]/(public)/shop/products/[slug]/_components/product-details-form.tsx`

Tính năng đã có:

- Chọn màu sản phẩm.
- Hiển thị tên màu đang chọn.
- Chọn size.
- Nút `Size Guide`.
- Nút `Add to Bag` kèm giá.
- Trust badges:
  - In stock, ready to ship
  - Ships within 24 hours
- Thông báo free shipping and returns.

### Frame specs và fit guide

Component: `src/components/lensora/frame-specs.tsx`

Tính năng đã có:

- Accordion thông số sản phẩm.
- Hiển thị measurements:
  - Lens width
  - Bridge width
  - Temple length
  - Total width
  - Weight
- Hiển thị thông tin frame:
  - Material
  - Shape
  - Lens type
  - Face fit
  - Gender
- Fit guide theo narrow, medium, wide.

## Collections UI

### Trang danh sách collections

Route: `/:lang/shop/collections`

Tính năng đã có:

- Header giới thiệu collections.
- Chỉ hiển thị collection có trạng thái `published`.
- Stats row:
  - Số collections
  - Số products published
  - Số materials
  - Số frame shapes
- Grid collection responsive.
- Mỗi collection card hiển thị ảnh cover, tên collection và số sản phẩm.
- Metadata SEO cho trang collections.

### Collection card

Component: `src/components/lensora/collection-card.tsx`

Tính năng đã có:

- Card ảnh lớn theo tỉ lệ dọc.
- Overlay gradient giúp text dễ đọc.
- Hover scale ảnh.
- Hiển thị số sản phẩm published trong collection.
- Tên collection.
- CTA `Shop now`.
- Link tới route chi tiết collection.

### Trang chi tiết collection

Route: `/:lang/shop/collections/:slug`

Tính năng đã có:

- Static params cho các collection `published`.
- Metadata SEO theo tên và mô tả collection.
- Trả về `notFound()` nếu collection không tồn tại hoặc không published.
- Hero banner lớn với cover image, tên collection và mô tả.
- Product grid chỉ lấy sản phẩm thuộc collection hiện tại.
- Tích hợp search, filters và sorting.

### Product grid trong collection

Component: `src/app/[lang]/(public)/shop/collections/[slug]/_components/collection-product-grid.tsx`

Tính năng đã có:

- Search theo tên sản phẩm và mô tả.
- Đếm số sản phẩm sau khi lọc.
- Sort sản phẩm theo:
  - Featured
  - Newest
  - Price low to high
  - Price high to low
- Grid responsive.
- Empty state khi không có sản phẩm phù hợp.

### Bộ lọc sản phẩm

Component: `src/components/lensora/product-filters.tsx`

Tính năng đã có:

- Sidebar filter trên desktop.
- Sheet filter trên mobile.
- Đếm số filter đang active.
- Clear all filters.
- Price range slider.
- Filter theo:
  - Frame shape
  - Material
  - Lens type
  - Gender
  - Face fit
- Checkbox controls dùng shadcn/ui.

### Sort sản phẩm

Component: `src/components/lensora/product-sort.tsx`

Tính năng đã có:

- Select dropdown cho sort.
- Các option có icon:
  - Featured
  - Newest
  - Price: Low to High
  - Price: High to Low

## Admin Products UI

Route: `/:lang/admin/products`

Tính năng đã có:

- Bảng quản lý sản phẩm.
- Search theo tên, SKU hoặc collection.
- Filter theo status:
  - All statuses
  - Published
  - Draft
  - Archived
- Thumbnail ảnh sản phẩm.
- Badge trạng thái sản phẩm.
- Hiển thị collection, giá, compare-at price và tồn kho.
- Cảnh báo tồn kho thấp bằng màu destructive.
- Menu action:
  - Edit product
  - View on storefront
- Empty state khi không có kết quả.

## Admin Product Form UI

Routes:

- `/:lang/admin/products/new`
- `/:lang/admin/products/:id/edit`

Tính năng đã có:

- Form dùng lại cho create và edit.
- Các nhóm field:
  - General Information
  - Images
  - Pricing & Inventory
  - Colors & Variants
  - SEO Fields
  - Status & Organization
  - Frame Specifications
  - Measurements
- Upload ảnh bằng file dropzone.
- Preview danh sách ảnh đã chọn.
- Hiển thị thứ tự ảnh.
- Quản lý màu sản phẩm:
  - Tên màu
  - Color picker
  - Add color
  - Remove color
- Status selector: draft, published, archived.
- Collection selector lấy từ mock collections.
- Featured product switch.
- Frame fields:
  - Shape
  - Material
  - Lens type
  - Face fit
  - Gender
  - Size
- Measurement fields:
  - Lens
  - Bridge
  - Temple
  - Total
  - Weight
- SEO title và SEO description.
- CTA `Draft with AI Writer`.
- Điều hướng cancel/save theo đúng locale hiện tại.

## Admin Collections UI

Route: `/:lang/admin/collections`

Tính năng đã có:

- Bảng quản lý collections.
- Search collection theo tên, slug hoặc mô tả.
- Thumbnail cover image.
- Badge trạng thái collection.
- Hiển thị số sản phẩm trong collection.
- Menu action:
  - Edit collection
  - View on storefront
- Empty state khi không có kết quả.
- Drawer tạo/chỉnh sửa collection với các field:
  - Name
  - Slug
  - Cover image URL
  - Description
- Nút save/cancel trong drawer.

## Dữ liệu và typing

Các UI trên dùng dữ liệu mock có type rõ ràng:

- `src/data/lensora/products.ts`
- `src/data/lensora/collections.ts`
- `ProductType`
- `CollectionType`
- `ProductStatus`
- `ColorVariant`
- `ProductSpecs`

Các field sản phẩm đã được hỗ trợ ở UI:

- id
- name
- slug
- description
- price
- compareAtPrice
- status
- collectionId
- images
- colors
- frameShape
- frameMaterial
- lensType
- faceFit
- gender
- size
- stock
- sku
- isFeatured
- specs
- seoTitle
- seoDescription
- createdAt
- updatedAt

## Trạng thái kỹ thuật

- Public shop ưu tiên server component.
- Các phần có tương tác như filter, sort, gallery, quick view và form dùng client component.
- Giao diện responsive cho mobile, tablet và desktop.
- Hỗ trợ dark mode thông qua token/theme hiện có.
- Dữ liệu sản phẩm và collection không hardcode trực tiếp trong UI page chính, mà lấy từ file data chuyên biệt.
