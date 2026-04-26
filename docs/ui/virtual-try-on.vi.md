# Thử kính ảo (Virtual Try-On)

Lensora cung cấp hệ thống Thử kính ảo (VTO) thời gian thực, chạy hoàn toàn trên trình duyệt, cho phép khách hàng xem trước các sản phẩm kính mắt bằng camera.

## Tổng quan

Hệ thống VTO sử dụng MediaPipe Face Landmarker để phát hiện 478 điểm mốc trên khuôn mặt trong thời gian thực. Nó tính toán vị trí, tỷ lệ và góc xoay của kính dựa trên vị trí mắt và sống mũi được phát hiện.

## Đường dẫn (Route)

- Thử kính chung: `/shop/try-on`
- Thử kính theo sản phẩm: `/shop/products/[slug]/try-on`

## Quyền truy cập Camera

- Người dùng phải cấp quyền truy cập camera để sử dụng tính năng này.
- Hệ thống xử lý các trạng thái "Từ chối quyền" và "Không tìm thấy camera" một cách thân thiện.
- Yêu cầu HTTPS để truy cập camera trong môi trường production.

## Quyền riêng tư

> [!IMPORTANT]
> **Quyền riêng tư là ưu tiên hàng đầu của chúng tôi.**
> - Tất cả các khung hình video được xử lý **tại địa phương** trên trình duyệt của bạn.
> - Dữ liệu video **không bao giờ** được tải lên máy chủ của chúng tôi.
> - Ảnh chụp màn hình chỉ được lưu vào bộ nhớ tạm thời của trình duyệt và không bao giờ được lưu trữ tự động.

## Triển khai kỹ thuật

- **Phát hiện khuôn mặt**: `@mediapipe/tasks-vision` (Face Landmarker).
- **Hiển thị**: Lớp phủ HTML5 Canvas trên phần tử `<video>`.
- **Mượt mà**: Vòng lặp RequestAnimationFrame với các bảng điều khiển thủ công để tinh chỉnh độ vừa vặn.
- **Chỉ ở Frontend**: Không có quá trình xử lý hoặc lưu trữ ở backend.

## Yêu cầu hình ảnh sản phẩm

Để có kết quả tốt nhất, hình ảnh kính mắt nên:
- Định dạng PNG hoặc WebP trong suốt.
- Góc nhìn trực diện.
- Độ phân giải cao.

## Điều chỉnh thủ công

Vì việc căn chỉnh tự động có thể thay đổi tùy thuộc vào ánh sáng và góc camera, chúng tôi cung cấp các công cụ điều chỉnh thủ công:
- **Tỷ lệ (Scale)**: Thay đổi kích thước kính.
- **Căn lề Dọc/Ngang**: Di chuyển vị trí kính.
- **Xoay (Rotation)**: Điều chỉnh góc nghiêng.

## Tính năng chụp ảnh

Người dùng có thể chụp ảnh mình đang đeo kính. Ảnh chụp sẽ được xem trước trong một cửa sổ và có thể tải xuống dưới dạng tệp PNG.

## Hạn chế (MVP)

- Hoạt động tốt nhất với một khuôn mặt tại một thời điểm.
- Yêu cầu ánh sáng tốt để theo dõi khuôn mặt ổn định.
- Không xử lý được trường hợp khuôn mặt bị che khuất (ví dụ: tay che mặt).
- Hiệu suất trên máy tính để bàn thường tốt hơn trên di động do yêu cầu xử lý WASM.
