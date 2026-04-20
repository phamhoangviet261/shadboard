# Logic API và kết nối database

Cập nhật lần cuối: 2026-04-20

## Mục đích

Tài liệu này mô tả trạng thái hiện tại của phần backend trong project, tập trung vào:

- các API route
- luồng xác thực
- kết nối database
- Prisma schema
- route protection
- những phần UI đã có nhưng backend chưa hoàn tất

Tài liệu này ghi lại "hiện trạng" của repository, không phải kiến trúc mục tiêu lý tưởng.

## Tech Stack

- Next.js App Router
- NextAuth.js với `CredentialsProvider`
- Prisma ORM
- PostgreSQL là datasource hiện tại trong Prisma
- Zod để validate request

## Phạm vi backend hiện có

Hiện tại project mới có 2 auth API route thực sự:

- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/sign-in/route.ts`

Project đã có UI cho register, forgot password, verify email, new password, nhưng backend API cho các flow này vẫn chưa được làm đầy đủ.

## Luồng tổng quan

### 1. Luồng đăng nhập

Luồng đăng nhập hiện tại hoạt động như sau:

1. Form trong `src/components/auth/sign-in-form.tsx` gọi `signIn("credentials")`.
2. NextAuth đọc cấu hình trong `src/configs/next-auth.ts`.
3. `CredentialsProvider.authorize()` gửi `POST` tới `${API_URL}/auth/sign-in`.
4. Route `src/app/api/auth/sign-in/route.ts` validate body bằng `SignInSchema`.
5. Route so sánh email và password gửi lên với object tĩnh `src/data/user.ts`.
6. Nếu khớp, API trả về user payload gồm `id`, `name`, `email`, `avatar`, `status`.
7. NextAuth đưa payload đó vào JWT và expose lại qua session provider.

Lưu ý quan trọng: route sign-in hiện tại **không** query Prisma và **không** query database.

### 2. Luồng session

Luồng session được xử lý như sau:

- `src/configs/next-auth.ts` đặt `session.strategy = "jwt"`
- callback `jwt` copy `id`, `name`, `email`, `avatar`, `status` từ user vào token
- callback `session` copy giá trị từ token sang `session.user`
- `src/app/[lang]/layout.tsx` gọi `getServerSession(authOptions)` rồi truyền session vào `src/providers/index.tsx`
- `src/providers/next-auth-provider.tsx` bọc app bằng `SessionProvider`

Vì app đang dùng JWT session, bảng `Session` trong Prisma đã được khai báo nhưng không phải cơ chế runtime chính cho luồng đăng nhập credentials hiện tại.

### 3. Luồng bảo vệ route

Route protection được định nghĩa bởi:

- `src/configs/auth-routes.ts`
- `src/lib/auth-routes.ts`
- `src/middleware.ts`

Hành vi:

- guest route: chỉ dành cho người chưa đăng nhập
- public route: ai cũng vào được
- các route còn lại: mặc định xem là protected

Route map hiện tại:

- guest: `/sign-in`, `/register`, `/forgot-password`, `/verify-email`, `/new-password`
- public: `/`, `/me`, `/docs`

Middleware sẽ check JWT bằng `getToken()` của `next-auth/jwt`. Nếu vào trang protected mà không có token thì user sẽ bị redirect sang `/sign-in`.

## API route đã có

### `POST /api/auth/sign-in`

File: `src/app/api/auth/sign-in/route.ts`

Request body:

```json
{
  "email": "name@example.com",
  "password": "Password123"
}
```

Validate:

- dùng `src/schemas/sign-in-schema.ts`
- `email` phải hợp lệ, lowercase, và trim
- `password` phải dài 8-250 ký tự, có ít nhất 1 chữ cái và 1 số

Logic hiện tại:

- so sánh request với `src/data/user.ts`
- trả `401` nếu sai thông tin đăng nhập
- trả `200` với thông tin user nếu đúng
- trả `400` nếu fail Zod validation
- trả `500` nếu có lỗi không mong muốn

Payload trả về khi thành công:

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "status": "string"
}
```

### `GET|POST /api/auth/[...nextauth]`

File: `src/app/api/auth/[...nextauth]/route.ts`

Route này ủy quyền toàn bộ xử lý NextAuth cho:

- `src/configs/next-auth.ts`

Đây là điểm vào cho:

- login bằng credentials
- tạo session
- auth callbacks

## Kết nối database

### Prisma client

File: `src/lib/prisma.ts`

Project tạo Prisma singleton:

- tạo `new PrismaClient()` một lần
- ở môi trường non-production, instance được cache trên `globalThis.prisma`
- cách này tránh tạo nhiều Prisma client khi hot reload

### Datasource

File: `prisma/schema.prisma`

Datasource hiện tại:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Điều đó có nghĩa là kết nối database runtime phụ thuộc vào `DATABASE_URL`.

### NextAuth adapter

File: `src/configs/next-auth.ts`

NextAuth đang được nối với Prisma bằng:

```ts
adapter: PrismaAdapter(db)
```

Tuy nhiên, trong code hiện tại:

- provider duy nhất là `CredentialsProvider`
- luồng credentials login dùng API sign-in nội bộ
- API sign-in lại so sánh với dữ liệu demo tĩnh, không query Prisma

Vì vậy Prisma adapter đã được gắn vào, nhưng đường đăng nhập đang chạy vẫn chủ yếu là logic demo.

## Prisma schema hiện tại

File: `prisma/schema.prisma`

### `User`

Model chính cho danh tính user và auth.

Field quan trọng:

- `id`
- `name`
- `username`
- `email`
- `emailVerifyToken`
- `emailVerified`
- `password`
- `passwordResetToken`
- `passwordResetExpires`
- `avatar`
- `profileBackground`
- `status`
- `createdAt`
- `updatedAt`

Relation:

- one-to-one với `UserPreference`
- one-to-many với `Account`
- one-to-many với `Session`

### `UserPreference`

Lưu các tùy chọn UI của từng user.

Fields:

- `theme`
- `mode`
- `radius`
- `layout`
- `direction`
- `userId`

### `Account`

Bảng chuẩn của NextAuth adapter cho external auth provider.

Field tiêu biểu:

- `provider`
- `providerAccountId`
- `access_token`
- `refresh_token`
- `expires_at`

Ghi chú: bảng này sẵn sàng cho OAuth provider, nhưng project hiện tại mới dùng credentials login.

### `Session`

Bảng session chuẩn của NextAuth.

Fields:

- `sessionToken`
- `userId`
- `expires`

Ghi chú: hiện tại app đang dùng JWT session, nên bảng này không phải thành phần trung tâm trong luồng sign-in đang chạy.

### `VerificationToken`

Bảng token chuẩn cho email/token-based auth flow.

Fields:

- `identifier`
- `token`
- `expires`

Ghi chú: schema đã chuẩn bị cho verify/reset flow, nhưng backend API cho các flow này vẫn chưa đủ.

## Các schema validate đã có sẵn

Project đã có Zod schema cho những flow sau:

- `src/schemas/sign-in-schema.ts`
- `src/schemas/register-schema.ts`
- `src/schemas/forgot-passward-schema.ts`
- `src/schemas/new-passward-schema.ts`
- `src/schemas/verify-email-schema.ts`

Điều này có nghĩa là cấu trúc validate ở UI đã có, dù backend route cho nhiều flow vẫn chưa được implement.

## Các điểm đáng nhớ và bất đồng bộ

Đây là những điểm quan trọng cần nhớ trước khi mở rộng backend:

### 1. Sign-in vẫn là demo logic

`POST /api/auth/sign-in` đang check credentials bằng `src/data/user.ts`, không dùng bảng `User`.

### 2. UI register đang gọi tới route chưa tồn tại

`src/components/auth/register-form.tsx` gửi `POST /api/register`, nhưng trong `src/app/api` không có route tương ứng.

### 3. UI verify email đang gọi tới route chưa tồn tại

`src/components/auth/verify-email-form.tsx` gửi `POST /api/auth/verify-email`, nhưng route này chưa có.

### 4. Forgot password và new password mới là UI

- `src/components/auth/forgot-password-form.tsx` hiện tại chỉ show toast
- `src/components/auth/new-password-form.tsx` hiện tại chỉ show toast

Chưa có thao tác ghi database hay verify token nào xảy ra.

### 5. Session callback đang có lỗi nhỏ ở trường status

Trong `src/configs/next-auth.ts`, session callback hiện tại đang viết:

```ts
token.status = token.status
```

Rất có thể ý đồ là:

```ts
session.user.status = token.status
```

Nghĩa là `status` đã có trong JWT, nhưng chưa được copy đúng vào `session.user`.

### 6. Prisma schema và migration history chưa khớp nhau

- `prisma/schema.prisma` hiện tại chỉ còn các model liên quan auth
- `prisma/migrations/20241026151136_init/migration.sql` vẫn còn chat-related tables cũ

Cho những bước sau này, nên xem `prisma/schema.prisma` là source of truth hiện tại và review lại migration history trước khi tạo migration mới.

### 7. `.env.example` đã cũ

`prisma/schema.prisma` đang dùng PostgreSQL, nhưng `.env.example` vẫn để:

```env
DATABASE_URL=file:./dev.db
```

Ví dụ này không còn khớp với datasource hiện tại nữa.

## Hướng backend nên làm tiếp

Nếu mục tiêu là chuyển từ demo auth sang auth thật dùng database, nên làm theo thứ tự sau:

1. Implement `POST /api/register` để tạo user bằng Prisma.
2. Hash password trước khi lưu vào `User.password`.
3. Thay logic so sánh dữ liệu tĩnh trong `/api/auth/sign-in` bằng `db.user.findUnique()`.
4. So sánh password bằng thư viện hash an toàn.
5. Implement `/api/auth/verify-email`.
6. Implement forgot-password và reset-password API bằng `passwordResetToken` và `passwordResetExpires`.
7. Sửa callback `session.user.status`.
8. Cập nhật `.env.example` theo PostgreSQL.
9. Đồng bộ lại Prisma migrations với schema hiện tại.

## Quick reference

### Các file chính

- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/configs/next-auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/sign-in/route.ts`
- `src/components/auth/sign-in-form.tsx`
- `src/components/auth/register-form.tsx`
- `src/components/auth/forgot-password-form.tsx`
- `src/components/auth/new-password-form.tsx`
- `src/components/auth/verify-email-form.tsx`
- `src/middleware.ts`
- `src/configs/auth-routes.ts`

### Biến môi trường đang dùng

- `BASE_URL`
- `API_URL`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `HOME_PATHNAME`
- `NEXT_PUBLIC_HOME_PATHNAME`
