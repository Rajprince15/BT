# Frontend Service Contract

Every service function in `src/services/**` returns the typed payload that the
backend will eventually return (the `{ success, data, meta }` envelope is
unwrapped before reaching the consumer). Mock and real implementations share
the same signature — toggle controlled by `NEXT_PUBLIC_USE_MOCKS`.

| Function | Signature returns | Mock source | Backend endpoint |
|---|---|---|---|
| **Auth** | | | |
| `authService.register(payload)` | `{ accessToken, user }` | `users.mock` + `_session` | `POST /api/auth/register` |
| `authService.login(payload)` | `{ accessToken, user }` | `users.mock` + `_session` | `POST /api/auth/login` |
| `authService.refresh()` | `{ accessToken, user }` | `_session` | `POST /api/auth/refresh` |
| `authService.logout()` | `{ success: true }` | `_session` | `POST /api/auth/logout` |
| `authService.me()` | `User` | `_session` + `users.mock` | `GET /api/auth/me` |
| `authService.changePassword(payload)` | `{ success: true }` | `_session` | `POST /api/auth/change-password` |
| **Catalog** | | | |
| `productService.list(params)` | `ListResponse<Product>` | `products.mock` | `GET /api/products` |
| `productService.bySlug(slug)` | `Product` | `products.mock` | `GET /api/products/:slug` |
| `productService.related(id)` | `Product[]` | `products.mock` | `GET /api/products/:id/related` |
| `productService.search(q)` | `ListResponse<Product>` | `products.mock` | `GET /api/products/search?q=` |
| `productService.allSlugs()` | `string[]` | `products.mock` | `GET /api/products/slugs` |
| `categoryService.tree()` | `Category[]` | `categories.mock` | `GET /api/categories` |
| `categoryService.getFeatured(limit?)` | `Category[]` | `categories.mock` | `GET /api/categories/featured` |
| `bannerService.list({ placement? })` | `Banner[]` | `banners.mock` | `GET /api/banners` |
| **Cart** | | | |
| `cartService.get()` | `Cart` | `cart.mock` + `_session` | `GET /api/cart` |
| `cartService.addItem(payload)` | `Cart` | `cart.mock` | `POST /api/cart/items` |
| `cartService.updateItem(id, payload)` | `Cart` | `cart.mock` | `PATCH /api/cart/items/:id` |
| `cartService.removeItem(id)` | `Cart` | `cart.mock` | `DELETE /api/cart/items/:id` |
| `cartService.bulkAdd(items)` | `Cart` | `cart.mock` | `POST /api/cart/bulk` |
| **Wishlist** | | | |
| `wishlistService.get()` | `Wishlist[]` | `wishlist.mock` | `GET /api/wishlist` |
| `wishlistService.add(productId)` | `Wishlist` | `wishlist.mock` | `POST /api/wishlist` |
| `wishlistService.remove(productId)` | `{ success: boolean }` | `wishlist.mock` | `DELETE /api/wishlist/:productId` |
| `wishlistService.toggle(productId)` | `{ removed: boolean, item? }` | `wishlist.mock` | `POST /api/wishlist/toggle` |
| **Orders** | | | |
| `orderService.listMine()` | `Order[]` | `orders.mock` | `GET /api/orders` |
| `orderService.byNumber(orderNumber)` | `Order` | `orders.mock` | `GET /api/orders/:orderNumber` |
| `orderService.cancel(orderNumber)` | `Order` | `orders.mock` | `PATCH /api/orders/:orderNumber/cancel` |
| `orderService.downloadInvoice(orderNumber)` | `Blob` | `orders.mock` | `GET /api/orders/:orderNumber/invoice` |
| **Reviews** | | | |
| `reviewService.listForProduct(productId, { page?, pageSize? })` | `ListResponse<Review>` | `reviews.mock` | `GET /api/reviews/product/:id` |
| `reviewService.canReview(productId)` | `boolean` | `reviews.mock` + `orders.mock` | `GET /api/reviews/product/:id/can-review` |
| `reviewService.toWrite()` | `OrderItem[]` | `orders.mock` + `reviews.mock` | `GET /api/reviews/to-write` |
| `reviewService.submit(payload)` | `Review` | `reviews.mock` | `POST /api/reviews` |
| **Checkout** | | | |
| `checkoutService.quote(payload)` | `Quote` | `cartService.get` | `POST /api/checkout/quote` |
| `checkoutService.createRazorpayOrder(payload)` | `RazorpayOrderResponse` | — | `POST /api/checkout/razorpay/order` |
| `checkoutService.verifyPayment(payload)` | `{ success: true, orderId, paymentId }` | — | `POST /api/checkout/razorpay/verify` |
| **Users / Addresses** | | | |
| `userService.profile()` | `User` | `users.mock` | `GET /api/users/me` |
| `userService.updateProfile(payload)` | `User` | `users.mock` | `PATCH /api/users/me` |
| `userService.addresses.list()` | `Address[]` | `addresses.mock` | `GET /api/users/addresses` |
| `userService.addresses.add(payload)` | `Address` | `addresses.mock` | `POST /api/users/addresses` |
| `userService.addresses.update(id, payload)` | `Address` | `addresses.mock` | `PATCH /api/users/addresses/:id` |
| `userService.addresses.remove(id)` | `{ success: boolean }` | `addresses.mock` | `DELETE /api/users/addresses/:id` |
| **Notifications** | | | |
| `notificationService.list()` | `Notification[]` | `notifications.mock` | `GET /api/notifications` |
| `notificationService.markRead(id)` | `{ success: boolean }` | `notifications.mock` | `POST /api/notifications/:id/read` |
| `notificationService.markAllRead()` | `{ success: boolean }` | `notifications.mock` | `POST /api/notifications/read-all` |
| **Public forms** | | | |
| `wholesaleService.submit(payload)` | `{ success: true, inquiryId }` | — | `POST /api/wholesale` |
| `newsletterService.subscribe(payload)` | `{ email, subscribed }` | — | `POST /api/newsletter/subscribe` |
| `contactService.submit(payload)` | `{ success, receivedAt }` | — | `POST /api/contact` |
| **Uploads** (Cloudinary signed) | | | |
| `uploadService.getSignature(folder)` | `UploadSignature` | env-derived | `GET /api/upload/signature` |
| `uploadService.upload(file)` | `UploadResult` | dataURL stub | `POST /api/upload` |
| `uploadService.persist(payload)` | `ProductImage` | stub | `POST /api/upload/persist` |
| **Admin — Products** | | | |
| `adminProductService.list(params)` | `ListResponse<Product>` | `products.mock` | `GET /api/admin/products` |
| `adminProductService.byId(id)` | `Product` | `products.mock` | `GET /api/admin/products/:id` |
| `adminProductService.create(payload)` | `Product` | `products.mock` | `POST /api/admin/products` |
| `adminProductService.update(id, payload)` | `Product` | `products.mock` | `PATCH /api/admin/products/:id` |
| `adminProductService.remove(id)` | `{ success: boolean }` | `products.mock` | `DELETE /api/admin/products/:id` |
| **Admin — Categories** | | | |
| `adminCategoryService.list()` | `Category[]` | `categories.mock` | `GET /api/admin/categories` |
| `adminCategoryService.create(payload)` | `Category` | `categories.mock` | `POST /api/admin/categories` |
| `adminCategoryService.update(id, payload)` | `Category` | `categories.mock` | `PATCH /api/admin/categories/:id` |
| `adminCategoryService.remove(id)` | `{ success: boolean }` | `categories.mock` | `DELETE /api/admin/categories/:id` |
| **Admin — Orders** | | | |
| `adminOrderService.list(params)` | `ListResponse<Order>` | `orders.mock` | `GET /api/admin/orders` |
| `adminOrderService.byNumber(orderNumber)` | `Order` | `orders.mock` | `GET /api/admin/orders/:orderNumber` |
| `adminOrderService.updateStatus(orderNumber, status)` | `Order` | `orders.mock` | `PATCH /api/admin/orders/:orderNumber/status` |
| **Admin — Customers** | | | |
| `adminCustomerService.list(params)` | `ListResponse<AdminCustomerWithStats>` | `users.mock` + `orders.mock` | `GET /api/admin/customers` |
| `adminCustomerService.byId(id)` | `User` | `users.mock` | `GET /api/admin/customers/:id` |
| `adminCustomerService.suspend(id)` | `User` | `users.mock` | `PATCH /api/admin/customers/:id/suspend` |
| `adminCustomerService.activate(id)` | `User` | `users.mock` | `PATCH /api/admin/customers/:id/activate` |
| **Admin — Dashboard** | | | |
| `adminDashboardService.kpis()` | `AdminDashboardKpis` | derived from all mocks | `GET /api/admin/dashboard` |
| **Admin — Banners** | | | |
| `adminBannerService.list()` | `Banner[]` | `banners.mock` | `GET /api/admin/banners` |
| `adminBannerService.create(payload)` | `Banner` | `banners.mock` | `POST /api/admin/banners` |
| `adminBannerService.update(id, payload)` | `Banner` | `banners.mock` | `PATCH /api/admin/banners/:id` |
| `adminBannerService.remove(id)` | `{ success: boolean }` | `banners.mock` | `DELETE /api/admin/banners/:id` |
| **Admin — Reviews** | | | |
| `adminReviewService.list(params)` | `ListResponse<Review>` | `reviews.mock` | `GET /api/admin/reviews` |
| `adminReviewService.moderate(id, status)` | `Review` | `reviews.mock` | `PATCH /api/admin/reviews/:id/moderate` |
| `adminReviewService.remove(id)` | `{ success: boolean }` | `reviews.mock` | `DELETE /api/admin/reviews/:id` |
| **Admin — Wholesale** | | | |
| `adminWholesaleService.list(params)` | `ListResponse<WholesaleInquiry>` | `wholesale.mock` | `GET /api/admin/wholesale` |
| `adminWholesaleService.updateStatus(id, status, notes?)` | `WholesaleInquiry` | `wholesale.mock` | `PATCH /api/admin/wholesale/:id/status` |
| **Admin — Audit** | | | |
| `adminAuditService.list(params)` | `ListResponse<AuditLog>` | in-memory store | `GET /api/admin/audit` |
| **Admin — Settings** | | | |
| `adminSettingsService.get()` | `AdminSettings` | in-memory store | `GET /api/admin/settings` |
| `adminSettingsService.update(payload)` | `AdminSettings` | in-memory store | `PATCH /api/admin/settings` |

## Mock runtime helpers (`services/_mock-runtime.ts`)

- `useMockService` — boolean read from `NEXT_PUBLIC_USE_MOCKS`.
- `simulateLatency(min=200, max=400)` — `Promise<void>`.
- `mockDelay` — back-compat alias of `simulateLatency`.
- `setMockErrorRate(rate)` / `getMockErrorRate()` — toggle 0–1 random failures.
- `simulateErrorRate(code?, message?)` — throws if the random roll hits the rate.
- `paginate(items, page, pageSize)` → `ListResponse<T>`.
- `filterByCategory(items, categoryId, descendantIds?)`.
