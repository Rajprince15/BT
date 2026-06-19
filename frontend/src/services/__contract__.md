# Frontend Service Contract

This file lists the frontend service functions and the backend endpoints they will map to during backend integration.

## Auth
- `authService.register(payload)` → `POST /api/auth/register`
- `authService.login(payload)` → `POST /api/auth/login`
- `authService.refresh()` → `POST /api/auth/refresh`
- `authService.logout()` → `POST /api/auth/logout`
- `authService.me()` → `GET /api/auth/me`
- `authService.changePassword(payload)` → `POST /api/auth/change-password`

## Products
- `productService.list(params)` → `GET /api/products`
- `productService.bySlug(slug)` → `GET /api/products/:slug`
- `productService.related(productId)` → `GET /api/products/:id/related`
- `productService.search(query)` → `GET /api/products/search?q=`
- `categoryService.tree()` → `GET /api/categories`
- `bannerService.list(params)` → `GET /api/banners`

## Cart
- `cartService.get()` → `GET /api/cart`
- `cartService.addItem(payload)` → `POST /api/cart/items`
- `cartService.updateItem(id, payload)` → `PATCH /api/cart/items/:id`
- `cartService.removeItem(id)` → `DELETE /api/cart/items/:id`
- `cartService.applyCoupon(code)` → `POST /api/cart/coupon`
- `cartService.removeCoupon()` → `DELETE /api/cart/coupon`

## Checkout
- `checkoutService.quote(payload)` → `POST /api/checkout/quote`
- `checkoutService.createRazorpayOrder(payload)` → `POST /api/checkout/razorpay/order`
- `checkoutService.verifyPayment(payload)` → `POST /api/checkout/razorpay/verify`

## Other services
- `wishlistService.get()` → `GET /api/wishlist`
- `wishlistService.add(productId)` → `POST /api/wishlist`
- `wishlistService.remove(productId)` → `DELETE /api/wishlist/:productId`
- `orderService.listMine()` → `GET /api/orders`
- `orderService.byNumber(orderNumber)` → `GET /api/orders/:orderNumber`
- `newsletterService.subscribe(payload)` → `POST /api/newsletter/subscribe`
- `contactService.submit(payload)` → `POST /api/contact`
