# Type / Database Mapping Reference

This file documents camelCase TypeScript entity names and corresponding snake_case MySQL columns in schema.sql.

- `users` → `User`
  - `email_verified` → `emailVerified`
  - `last_login_at` → `lastLoginAt`
  - `created_at` → `createdAt`
  - `updated_at` → `updatedAt`
  - `deleted_at` → `deletedAt`

- `addresses` → `Address`
  - `full_name` → `fullName`
  - `address_line1` → `addressLine1`
  - `address_line2` → `addressLine2`
  - `is_default` → `isDefault`

- `categories` → `Category`
  - `parent_id` → `parentId`
  - `image_url` → `imageUrl`
  - `sort_order` → `sortOrder`
  - `is_active` → `isActive`

- `products` → `Product`
  - `category_id` → `categoryId`
  - `short_description` → `shortDescription`
  - `sale_price` → `salePrice`
  - `weight_grams` → `weightGrams`
  - `best_seller` → `bestSeller`
  - `new_arrival` → `newArrival`
  - `rating_avg` → `ratingAvg`
  - `rating_count` → `ratingCount`
  - `meta_title` → `metaTitle`
  - `meta_description` → `metaDescription`

- `product_images` → `ProductImage`
  - `image_url` → `imageUrl`
  - `cloud_id` → `cloudId`
  - `alt_text` → `altText`
  - `sort_order` → `sortOrder`

- `product_variants` → `ProductVariant`
  - `is_active` → `isActive`

- `carts` + `cart_items` → `Cart`, `CartItem`
  - `variant_id` → `variantId`

- `wishlists` → `Wishlist`

- `orders` + `order_items` → `Order`, `OrderItem`
  - `order_number` → `orderNumber`
  - `shipping_amount` → `shippingAmount`
  - `tax_amount` → `taxAmount`
  - `total_amount` → `totalAmount`
  - `shipping_address_json` → `shippingAddressJson`
  - `billing_address_json` → `billingAddressJson`
  - `payment_status` → `paymentStatus`
  - `order_status` → `orderStatus`
  - `placed_at` → `placedAt`
  - `cancelled_at` → `cancelledAt`
  - `delivered_at` → `deliveredAt`

- `payments` → `Payment`
  - `razorpay_order_id` → `razorpayOrderId`
  - `razorpay_payment_id` → `razorpayPaymentId`
  - `razorpay_signature` → `razorpaySignature`
  - `raw_payload_json` → `rawPayloadJson`

- `reviews` → `Review`

- `banners` → `Banner`
  - `link_url` → `linkUrl`
  - `category_id` → `categoryId`
  - `sort_order` → `sortOrder`
  - `start_at` → `startAt`
  - `end_at` → `endAt`

- `wholesale_inquiries` → `WholesaleInquiry`
  - `contact_person` → `contactPerson`
  - `business_type` → `businessType`
  - `product_interest` → `productInterest`
  - `quantity_requirement` → `quantityRequirement`

- `newsletter_subscribers` → `NewsletterSubscriber`

- `contact_messages` → `ContactMessage`

- `audit_logs` → `AuditLog`

- `security_logs` → `SecurityLog`

- `notifications` is client-derived in frontend phase and does not map to a direct schema table.
