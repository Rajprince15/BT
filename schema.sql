-- ============================================================
-- 04 — BHAVITA TEXTILES :: COMPLETE MySQL SCHEMA (DDL)
-- Engine: InnoDB · Charset: utf8mb4 · Collation: utf8mb4_unicode_ci
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------- USERS ----------
CREATE TABLE users (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(190)  NOT NULL,
  phone           VARCHAR(20)   NULL,
  password_hash   VARCHAR(255)  NOT NULL,
  role            ENUM('customer','admin','super_admin') NOT NULL DEFAULT 'customer',
  email_verified  TINYINT(1)    NOT NULL DEFAULT 0,
  email_verification_token VARCHAR(120) NULL,
  password_reset_token     VARCHAR(120) NULL,
  password_reset_expires   DATETIME      NULL,
  last_login_at   DATETIME      NULL,
  status          ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME      NULL,
  UNIQUE KEY uq_users_email (email),
  KEY ix_users_role (role),
  KEY ix_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh tokens for rotation / revocation
CREATE TABLE refresh_tokens (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  token_hash    VARCHAR(255)    NOT NULL,
  user_agent    VARCHAR(255)    NULL,
  ip_address    VARCHAR(64)     NULL,
  expires_at    DATETIME        NOT NULL,
  revoked_at    DATETIME        NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_rt_user (user_id),
  KEY ix_rt_expires (expires_at),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- ADDRESSES ----------
CREATE TABLE addresses (
  id             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  full_name      VARCHAR(120) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  address_line1  VARCHAR(255) NOT NULL,
  address_line2  VARCHAR(255) NULL,
  city           VARCHAR(80)  NOT NULL,
  state          VARCHAR(80)  NOT NULL,
  pincode        VARCHAR(20)  NOT NULL,
  country        VARCHAR(80)  NOT NULL DEFAULT 'India',
  is_default     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY ix_addr_user (user_id),
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- CATEGORIES (nested) ----------
CREATE TABLE categories (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  parent_id   BIGINT UNSIGNED NULL,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL,
  description TEXT NULL,
  image_url   VARCHAR(500) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME NULL,
  UNIQUE KEY uq_cat_slug (slug),
  KEY ix_cat_parent (parent_id),
  KEY ix_cat_active (is_active),
  CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- PRODUCTS ----------
CREATE TABLE products (
  id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  category_id         BIGINT UNSIGNED NOT NULL,
  name                VARCHAR(200) NOT NULL,
  slug                VARCHAR(220) NOT NULL,
  sku                 VARCHAR(80)  NOT NULL,
  short_description   VARCHAR(500) NULL,
  description         LONGTEXT     NULL,
  price               DECIMAL(12,2) NOT NULL,
  sale_price          DECIMAL(12,2) NULL,
  stock               INT NOT NULL DEFAULT 0,
  weight_grams        INT NULL,
  featured            TINYINT(1) NOT NULL DEFAULT 0,
  best_seller         TINYINT(1) NOT NULL DEFAULT 0,
  new_arrival         TINYINT(1) NOT NULL DEFAULT 0,
  status              ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  rating_avg          DECIMAL(3,2) NOT NULL DEFAULT 0,
  rating_count        INT NOT NULL DEFAULT 0,
  meta_title          VARCHAR(180) NULL,
  meta_description    VARCHAR(320) NULL,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          DATETIME NULL,
  UNIQUE KEY uq_prod_slug (slug),
  UNIQUE KEY uq_prod_sku (sku),
  KEY ix_prod_category (category_id),
  KEY ix_prod_status (status),
  KEY ix_prod_flags (featured, best_seller, new_arrival),
  KEY ix_prod_price (price),
  FULLTEXT KEY ftx_prod_search (name, short_description, description),
  CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id  BIGINT UNSIGNED NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  cloud_id    VARCHAR(255) NULL,
  alt_text    VARCHAR(255) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_pi_product (product_id, sort_order),
  CONSTRAINT fk_pi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id  BIGINT UNSIGNED NOT NULL,
  sku         VARCHAR(80)  NOT NULL,
  size        VARCHAR(40)  NULL,
  color       VARCHAR(40)  NULL,
  price       DECIMAL(12,2) NULL,
  stock       INT NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pv_sku (sku),
  KEY ix_pv_product (product_id),
  CONSTRAINT fk_pv_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- CART ----------
CREATE TABLE carts (
  id         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_user (user_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  cart_id     BIGINT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  variant_id  BIGINT UNSIGNED NULL,
  quantity    INT NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ci_unique (cart_id, product_id, variant_id),
  KEY ix_ci_product (product_id),
  CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)    REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_ci_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- WISHLIST ----------
CREATE TABLE wishlists (
  id         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wl (user_id, product_id),
  CONSTRAINT fk_wl_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_wl_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- ORDERS ----------
CREATE TABLE orders (
  id                 BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id            BIGINT UNSIGNED NOT NULL,
  order_number       VARCHAR(32)  NOT NULL,
  subtotal           DECIMAL(12,2) NOT NULL,
  discount_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount         DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount       DECIMAL(12,2) NOT NULL,
  currency           CHAR(3) NOT NULL DEFAULT 'INR',
  coupon_code        VARCHAR(40) NULL,
  shipping_address_json JSON NOT NULL,
  billing_address_json  JSON NULL,
  payment_status     ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  order_status       ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  notes              TEXT NULL,
  placed_at          DATETIME NULL,
  cancelled_at       DATETIME NULL,
  delivered_at       DATETIME NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_order_number (order_number),
  KEY ix_order_user (user_id),
  KEY ix_order_status (order_status),
  KEY ix_order_payment (payment_status),
  KEY ix_order_created (created_at),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  variant_id    BIGINT UNSIGNED NULL,
  product_name  VARCHAR(200) NOT NULL,
  product_sku   VARCHAR(80)  NOT NULL,
  quantity      INT NOT NULL,
  price         DECIMAL(12,2) NOT NULL,
  line_total    DECIMAL(12,2) NOT NULL,
  KEY ix_oi_order (order_id),
  KEY ix_oi_product (product_id),
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_oi_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- PAYMENTS ----------
CREATE TABLE payments (
  id                   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id             BIGINT UNSIGNED NOT NULL,
  razorpay_order_id    VARCHAR(80)  NULL,
  razorpay_payment_id  VARCHAR(80)  NULL,
  razorpay_signature   VARCHAR(255) NULL,
  amount               DECIMAL(12,2) NOT NULL,
  currency             CHAR(3) NOT NULL DEFAULT 'INR',
  status               ENUM('created','authorized','captured','failed','refunded') NOT NULL DEFAULT 'created',
  raw_payload_json     JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pay_rp_payment (razorpay_payment_id),
  KEY ix_pay_order (order_id),
  KEY ix_pay_status (status),
  CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- REVIEWS ----------
CREATE TABLE reviews (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  order_id    BIGINT UNSIGNED NULL,
  rating      TINYINT UNSIGNED NOT NULL,
  title       VARCHAR(180) NULL,
  review      TEXT NULL,
  status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_review_per_order (user_id, product_id, order_id),
  KEY ix_rev_product (product_id, status),
  CONSTRAINT fk_rev_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_rev_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE SET NULL,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ---------- COUPONS ----------
CREATE TABLE coupons (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code            VARCHAR(40) NOT NULL,
  description     VARCHAR(255) NULL,
  discount_type   ENUM('flat','percent') NOT NULL,
  discount_value  DECIMAL(10,2) NOT NULL,
  min_cart_value  DECIMAL(12,2) NOT NULL DEFAULT 0,
  max_discount    DECIMAL(12,2) NULL,
  usage_limit     INT NULL,
  used_count      INT NOT NULL DEFAULT 0,
  per_user_limit  INT NULL,
  start_date      DATETIME NOT NULL,
  end_date        DATETIME NOT NULL,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_coupon_code (code),
  KEY ix_coupon_active (is_active, end_date)
) ENGINE=InnoDB;

CREATE TABLE coupon_usages (
  id         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  coupon_id  BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  order_id   BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_cu_coupon (coupon_id),
  KEY ix_cu_user (user_id),
  CONSTRAINT fk_cu_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  CONSTRAINT fk_cu_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_cu_order  FOREIGN KEY (order_id)  REFERENCES orders(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- BANNERS ----------
CREATE TABLE banners (
  id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title        VARCHAR(180) NOT NULL,
  subtitle     VARCHAR(255) NULL,
  image_url    VARCHAR(500) NOT NULL,
  link_url     VARCHAR(500) NULL,
  placement    ENUM('home_hero','home_promo','category','sidebar') NOT NULL,
  category_id  BIGINT UNSIGNED NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  start_at     DATETIME NULL,
  end_at       DATETIME NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY ix_banner_placement (placement, is_active),
  CONSTRAINT fk_banner_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- WHOLESALE ----------
CREATE TABLE wholesale_inquiries (
  id                    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  company_name          VARCHAR(180) NOT NULL,
  contact_person        VARCHAR(120) NOT NULL,
  email                 VARCHAR(190) NOT NULL,
  phone                 VARCHAR(20)  NOT NULL,
  business_type         VARCHAR(80)  NULL,
  product_interest      VARCHAR(255) NULL,
  quantity_requirement  VARCHAR(120) NULL,
  message               TEXT NULL,
  status                ENUM('new','contacted','qualified','won','lost') NOT NULL DEFAULT 'new',
  notes                 TEXT NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY ix_wsi_status (status, created_at)
) ENGINE=InnoDB;

-- ---------- NEWSLETTER & CONTACT ----------
CREATE TABLE newsletter_subscribers (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email       VARCHAR(190) NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_news_email (email)
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL,
  phone      VARCHAR(20)  NULL,
  subject    VARCHAR(180) NULL,
  message    TEXT NOT NULL,
  status     ENUM('new','read','closed') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- LOGGING / AUDIT ----------
CREATE TABLE audit_logs (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  actor_id    BIGINT UNSIGNED NULL,
  actor_role  VARCHAR(40) NULL,
  action      VARCHAR(80) NOT NULL,
  entity      VARCHAR(80) NOT NULL,
  entity_id   VARCHAR(80) NULL,
  before_json JSON NULL,
  after_json  JSON NULL,
  ip_address  VARCHAR(64) NULL,
  user_agent  VARCHAR(255) NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_audit_actor (actor_id),
  KEY ix_audit_entity (entity, entity_id),
  KEY ix_audit_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE security_logs (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NULL,
  event       VARCHAR(80) NOT NULL,    -- login_success, login_fail, password_change, lockout, suspicious_request
  ip_address  VARCHAR(64) NULL,
  user_agent  VARCHAR(255) NULL,
  meta_json   JSON NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_sec_user (user_id),
  KEY ix_sec_event (event, created_at)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
