from pathlib import Path
import textwrap

base = Path(__file__).resolve().parent

files = {
    'src/types/api.ts': textwrap.dedent('''
        export interface PaginationMeta {
          page: number;
          pageSize: number;
          total: number;
          totalPages: number;
        }

        export interface ApiSuccess<T> {
          success: true;
          data: T;
          meta?: PaginationMeta;
        }

        export interface ApiError {
          success: false;
          error: {
            code: string;
            message: string;
            fields?: Record<string, string>;
          };
        }

        export type ApiResponse<T> = ApiSuccess<T> | ApiError;
        export interface ListResponse<T> {
          items: T[];
          meta: PaginationMeta;
        }
    ''').strip(),
    'src/types/_mapping.md': textwrap.dedent('''
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
          - `discount_amount` → `discountAmount`
          - `shipping_amount` → `shippingAmount`
          - `tax_amount` → `taxAmount`
          - `total_amount` → `totalAmount`
          - `coupon_code` → `couponCode`
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

        - `coupons` → `Coupon`
          - `discount_type` → `discountType`
          - `discount_value` → `discountValue`
          - `min_cart_value` → `minCartValue`
          - `max_discount` → `maxDiscount`
          - `usage_limit` → `usageLimit`
          - `used_count` → `usedCount`
          - `per_user_limit` → `perUserLimit`

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
    ''').strip(),
    'src/types/User.ts': textwrap.dedent('''
        export type UserRole = 'customer' | 'admin' | 'super_admin';
        export type UserStatus = 'active' | 'suspended' | 'deleted';

        export interface User {
          id: number;
          name: string;
          email: string;
          phone?: string;
          role: UserRole;
          emailVerified: boolean;
          status: UserStatus;
          lastLoginAt?: string;
          createdAt: string;
          updatedAt: string;
          deletedAt?: string;
        }
    ''').strip(),
    'src/types/Address.ts': textwrap.dedent('''
        export interface Address {
          id: number;
          userId: number;
          fullName: string;
          phone: string;
          addressLine1: string;
          addressLine2?: string;
          city: string;
          state: string;
          pincode: string;
          country: string;
          isDefault: boolean;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/Category.ts': textwrap.dedent('''
        export interface Category {
          id: number;
          parentId?: number;
          name: string;
          slug: string;
          description?: string;
          imageUrl?: string;
          sortOrder: number;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
          deletedAt?: string;
          children?: Category[];
        }
    ''').strip(),
    'src/types/ProductImage.ts': textwrap.dedent('''
        export interface ProductImage {
          id: number;
          productId: number;
          imageUrl: string;
          cloudId?: string;
          altText?: string;
          sortOrder: number;
          createdAt: string;
        }
    ''').strip(),
    'src/types/ProductVariant.ts': textwrap.dedent('''
        export interface ProductVariant {
          id: number;
          productId: number;
          sku: string;
          size?: string;
          color?: string;
          price?: number;
          stock: number;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/Product.ts': textwrap.dedent('''
        import { ProductImage } from './ProductImage';
        import { ProductVariant } from './ProductVariant';

        export type ProductStatus = 'draft' | 'published' | 'archived';

        export interface Product {
          id: number;
          categoryId: number;
          name: string;
          slug: string;
          sku: string;
          shortDescription?: string;
          description?: string;
          price: number;
          salePrice?: number;
          stock: number;
          weightGrams?: number;
          featured: boolean;
          bestSeller: boolean;
          newArrival: boolean;
          status: ProductStatus;
          ratingAvg: number;
          ratingCount: number;
          metaTitle?: string;
          metaDescription?: string;
          createdAt: string;
          updatedAt: string;
          deletedAt?: string;
          images: ProductImage[];
          variants: ProductVariant[];
          aggregateRating: number;
          reviewCount: number;
        }
    ''').strip(),
    'src/types/CartItem.ts': textwrap.dedent('''
        export interface CartItem {
          id: number;
          cartId: number;
          productId: number;
          variantId?: number;
          quantity: number;
          price: number;
          productName: string;
          productSku: string;
          imageUrl?: string;
        }
    ''').strip(),
    'src/types/Cart.ts': textwrap.dedent('''
        import { CartItem } from './CartItem';

        export interface Cart {
          id: number;
          userId: number;
          items: CartItem[];
          subtotal: number;
          discount: number;
          shipping: number;
          tax: number;
          total: number;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/Wishlist.ts': textwrap.dedent('''
        export interface Wishlist {
          id: number;
          userId: number;
          productId: number;
          createdAt: string;
        }
    ''').strip(),
    'src/types/OrderItem.ts': textwrap.dedent('''
        export interface OrderItem {
          id: number;
          orderId: number;
          productId: number;
          variantId?: number;
          productName: string;
          productSku: string;
          quantity: number;
          price: number;
          lineTotal: number;
        }
    ''').strip(),
    'src/types/Order.ts': textwrap.dedent('''
        import { OrderItem } from './OrderItem';

        export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
        export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

        export interface Order {
          id: number;
          userId: number;
          orderNumber: string;
          subtotal: number;
          discountAmount: number;
          shippingAmount: number;
          taxAmount: number;
          totalAmount: number;
          currency: 'INR';
          couponCode?: string;
          shippingAddressJson: Record<string, unknown>;
          billingAddressJson?: Record<string, unknown>;
          paymentStatus: PaymentStatus;
          orderStatus: OrderStatus;
          notes?: string;
          placedAt?: string;
          cancelledAt?: string;
          deliveredAt?: string;
          createdAt: string;
          updatedAt: string;
          items?: OrderItem[];
        }
    ''').strip(),
    'src/types/Payment.ts': textwrap.dedent('''
        export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

        export interface Payment {
          id: number;
          orderId: number;
          razorpayOrderId?: string;
          razorpayPaymentId?: string;
          razorpaySignature?: string;
          amount: number;
          currency: 'INR';
          status: PaymentStatus;
          rawPayloadJson?: Record<string, unknown>;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/Review.ts': textwrap.dedent('''
        export type ReviewStatus = 'pending' | 'approved' | 'rejected';

        export interface Review {
          id: number;
          userId: number;
          productId: number;
          orderId?: number;
          rating: number;
          title?: string;
          review?: string;
          status: ReviewStatus;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/Coupon.ts': textwrap.dedent('''
        export type CouponDiscountType = 'flat' | 'percent';

        export interface Coupon {
          id: number;
          code: string;
          description?: string;
          discountType: CouponDiscountType;
          discountValue: number;
          minCartValue: number;
          maxDiscount?: number;
          usageLimit?: number;
          usedCount: number;
          perUserLimit?: number;
          startDate: string;
          endDate: string;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/Banner.ts': textwrap.dedent('''
        export type BannerPlacement = 'home_hero' | 'home_promo' | 'category' | 'sidebar';

        export interface Banner {
          id: number;
          title: string;
          subtitle?: string;
          imageUrl: string;
          linkUrl?: string;
          placement: BannerPlacement;
          categoryId?: number;
          sortOrder: number;
          startAt?: string;
          endAt?: string;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/WholesaleInquiry.ts': textwrap.dedent('''
        export type WholesaleInquiryStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

        export interface WholesaleInquiry {
          id: number;
          companyName: string;
          contactPerson: string;
          email: string;
          phone: string;
          businessType?: string;
          productInterest?: string;
          quantityRequirement?: string;
          message?: string;
          status: WholesaleInquiryStatus;
          notes?: string;
          createdAt: string;
          updatedAt: string;
        }
    ''').strip(),
    'src/types/NewsletterSubscriber.ts': textwrap.dedent('''
        export interface NewsletterSubscriber {
          id: number;
          email: string;
          isActive: boolean;
          createdAt: string;
        }
    ''').strip(),
    'src/types/ContactMessage.ts': textwrap.dedent('''
        export type ContactMessageStatus = 'new' | 'read' | 'closed';

        export interface ContactMessage {
          id: number;
          name: string;
          email: string;
          phone?: string;
          subject?: string;
          message: string;
          status: ContactMessageStatus;
          createdAt: string;
        }
    ''').strip(),
    'src/types/AuditLog.ts': textwrap.dedent('''
        export interface AuditLog {
          id: number;
          actorId?: number;
          actorRole?: string;
          action: string;
          entity: string;
          entityId?: string;
          beforeJson?: Record<string, unknown>;
          afterJson?: Record<string, unknown>;
          ipAddress?: string;
          userAgent?: string;
          createdAt: string;
        }
    ''').strip(),
    'src/types/SecurityLog.ts': textwrap.dedent('''
        export interface SecurityLog {
          id: number;
          userId?: number;
          event: string;
          ipAddress?: string;
          userAgent?: string;
          metaJson?: Record<string, unknown>;
          createdAt: string;
        }
    ''').strip(),
    'src/types/Notification.ts': textwrap.dedent('''
        export type NotificationType = 'order' | 'broadcast' | 'system';

        export interface Notification {
          id: number;
          type: NotificationType;
          title: string;
          message: string;
          createdAt: string;
          read: boolean;
          relatedOrderId?: number;
        }
    ''').strip(),
}

for relative_path, content in files.items():
    path = base / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content + 'n', encoding='utf-8')

print(f'wrote {len(files)} type files')
