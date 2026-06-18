ROLE
You are a team consisting of:
•	Senior Product Manager
•	Senior UX/UI Designer
•	Senior Full Stack Architect
•	Senior Database Architect
•	Senior Security Engineer
•	Senior DevOps Engineer
•	Senior E-commerce Consultant
Your task is to design and build a COMPLETE PRODUCTION-READY enterprise-grade e-commerce platform for a premium luxury textile and home furnishing brand called:
BHAVITA TEXTILES
IMPORTANT
This is NOT a college project.
This is a real client website that will be used in production with real customers, real payments, real orders, and real business operations.
Everything must be designed for production.
The final solution must be scalable, secure, maintainable, mobile-first, SEO-friendly, and suitable for long-term commercial use.

ADDITIONAL PRODUCTION REQUIREMENTS
Treat this project as a real-world production e-commerce platform handling real customers, orders, inventory, payments, and business operations.
Do NOT generate code as a college project or tutorial application.
==================================================
ENTERPRISE SECURITY REQUIREMENTS
Implement enterprise-grade security throughout the application.
Access Control:
•	Role Based Access Control (RBAC)
•	Super Admin
•	Admin
•	Customer
Requirements:
•	Users must never be able to access admin pages by manually editing URLs.
•	Users must never access another user's data.
•	Users must never view another user's orders.
•	Users must never modify order amounts.
•	Users must never modify product prices from the frontend.
•	Users must never modify stock quantities.
•	Users must never access protected APIs without authentication.
•	All permissions must be verified on the server.
Authentication:
•	JWT Access Token
•	Refresh Token Rotation
•	Secure Logout
•	Password Reset Flow
•	Email Verification
•	Session Expiration
Password Security:
•	bcrypt hashing
•	Strong password policies
•	Password reset token expiry
API Security:
•	Rate Limiting
•	Request Validation
•	Input Sanitization
•	Output Encoding
•	API Authorization Middleware
•	Protected Routes
Protection Against:
•	SQL Injection
•	XSS
•	CSRF
•	SSRF
•	Clickjacking
•	Session Hijacking
•	Broken Authentication
•	Broken Access Control
•	Directory Traversal
•	File Upload Exploits
File Upload Security:
•	Image MIME Validation
•	File Size Limits
•	Filename Sanitization
•	Malware Scan Hook Support
•	Cloudinary Upload Restrictions
Security Logging:
•	Login Attempts
•	Failed Logins
•	Password Changes
•	Admin Actions
•	Product Updates
•	Order Status Changes
Brand Style:
Luxury
Royal
Classic
Premium
Elegant
Timeless
Design Inspiration:
Luxury textile brands
Luxury home décor brands
Premium furniture brands
Theme Requirements:
Light Theme
Dark Theme
Theme Switching:
•	User controlled
•	Saved in local storage
•	Persist across sessions
Color Palette:
Primary:
Royal Gold
Secondary:
Ivory White
Accent:
Deep Navy
Dark Mode:
Luxury Black
Gold Accents
Typography:
Elegant Serif Headings
Modern Sans Body Text
Animations:
Subtle
Premium
Professional
Avoid:
Cheap ecommerce appearance
Generic templates
Basic bootstrap look

==================================================
PAYMENT SECURITY REQUIREMENTS
Never trust any payment information coming from the frontend.
Requirements:
•	Order amount calculated only on backend.
•	Cart validation before payment.
•	Razorpay signature verification on backend.
•	Order creation only after successful verification.
•	Stock deduction only after payment confirmation.
•	Prevent duplicate payments.
•	Prevent replay attacks.
•	Secure invoice generation.
==================================================
PRODUCTION DATABASE REQUIREMENTS
Design for future scaling.
Requirements:
•	Proper Indexing
•	Foreign Keys
•	Database Constraints
•	Soft Deletes
•	Audit Tables
•	Transaction Handling
•	Rollback Strategy
Generate:
•	Database Optimization Plan
•	Query Optimization Plan
•	Backup Strategy
==================================================
SEO REQUIREMENTS
Implement complete e-commerce SEO.
Requirements:
•	Dynamic Meta Tags
•	Open Graph Tags
•	Twitter Cards
•	Structured Data
•	Product Schema
•	Breadcrumb Schema
•	XML Sitemap
•	robots.txt
•	Canonical URLs
Generate complete SEO architecture.
==================================================
PERFORMANCE REQUIREMENTS
Target:
•	Lighthouse Score 90+
•	Fast Mobile Experience
•	Core Web Vitals Optimization
Implement:
•	Image Optimization
•	Lazy Loading
•	Code Splitting
•	Dynamic Imports
•	Caching Strategy
•	Database Query Optimization
•	CDN Ready Assets
==================================================
LUXURY BRAND EXPERIENCE
The website should feel like a premium luxury brand.
Avoid:
•	Generic ecommerce appearance
•	Cheap templates
•	Crowded layouts
•	Excessive animations
Focus On:
•	Premium Typography
•	Elegant Layouts
•	Luxury Visual Hierarchy
•	High-End Product Presentation
•	Immersive Product Pages
Design Inspiration:
Luxury Home Decor Brands
Luxury Textile Brands
Luxury Furniture Brands
==================================================
ADMIN EXPERIENCE
Admin dashboard should be enterprise-grade.
Features:
•	Product Management
•	Inventory Management
•	Sales Analytics
•	Revenue Reports
•	Customer Insights
•	Wholesale Inquiry Management
•	Coupon Management
•	Banner Management
•	Review Moderation
Admin actions must be logged.
==================================================
MONITORING AND LOGGING
Generate:
•	Error Logging Strategy
•	Application Monitoring
•	Audit Logging
•	Payment Logs
•	Security Logs
==================================================
BACKUP AND RECOVERY
Generate:
•	Daily Database Backups
•	Weekly Full Backups
•	Media Backup Strategy
•	Disaster Recovery Plan
==================================================
PRODUCTION DEPLOYMENT
Target Environment:
Development:
Windows Laptop
Production:
Ubuntu VPS
Generate:
•	PM2 Setup
•	Nginx Setup
•	SSL Configuration
•	Security Headers
•	Firewall Rules
•	Environment Variable Strategy
•	Deployment Checklist
==================================================
QUALITY STANDARDS
Code must be:
•	Production Ready
•	Scalable
•	Secure
•	Modular
•	Maintainable
•	Well Documented
•	Enterprise Grade
Whenever there is a choice between a quick solution and a secure production-grade solution, always choose the production-grade solution.

PROJECT OVERVIEW
Build a complete production-ready premium textile and home furnishing e-commerce platform for "Bhavita Textiles".
Brand Positioning:
Handcrafted Home Textiles & Decor for Elegant Living
Alternative:
Premium Handloom, Home Furnishing & Handicrafts
TARGET USERS
1.	Retail Customers
2.	Wholesale/Bulk Buyers
3.	Interior Designers
4.	Hotels & Resorts
5.	Corporate Buyers
6.	Administrators
TECH STACK
Frontend:
•	Next.js 15 (App Router)
•	TypeScript
•	Tailwind CSS
•	ShadCN UI
•	React Query
•	Axios
Backend:
•	Next.js API Routes or Express.js
•	Node.js
•	JWT Authentication
•	Role Based Access Control
Database:
•	MySQL
Storage:
•	Cloudinary for product images
Payment Gateway:
•	Razorpay
Deployment:
•	Ubuntu VPS
•	Nginx
•	PM2
•	SSL
WEBSITE STRUCTURE
HOME
Sections:
•	Hero Banner
•	Featured Categories
•	New Arrivals
•	Best Sellers
•	Seasonal Collections
•	Handloom Heritage Collection
•	Testimonials
•	Brand Story
•	Wholesale CTA
•	Newsletter Subscription
SHOP
Bedroom Collection
Bedsheets
•	Cotton Bedsheets
•	Handloom Bedsheets
•	Printed Bedsheets
•	Premium Collection
•	King Size
•	Queen Size
•	Kids Collection
Blankets & Comforters
•	Cotton Blankets
•	Winter Blankets
•	AC Blankets
•	Quilts
•	Dohars
Pillows & Bedding Accessories
•	Pillow Covers
•	Cushion Covers
•	Bed Runners
Living Room Collection
Soft Furnishings
•	Sofa Throws
•	Sofa Covers
•	Cushion Covers
Curtains
•	Sheer Curtains
•	Blackout Curtains
•	Cotton Curtains
•	Printed Curtains
•	Luxury Curtains
Rugs & Carpets
•	Handwoven Rugs
•	Cotton Rugs
•	Floor Rugs
•	Area Rugs
•	Carpets
•	Runner Carpets
Door Mats
•	Cotton Door Mats
•	Anti Slip Mats
•	Decorative Mats
•	Outdoor Mats
Bath Collection
Towels
•	Bath Towels
•	Hand Towels
•	Face Towels
•	Luxury Towels
•	Hotel Towels
Bath Mats
Home Decor
•	Wall Decor
•	Table Linen
•	Decorative Textiles
•	Handmade Decor
•	Festive Decor
•	Cushion Styling Collection
Handloom Heritage Collection
•	Jaipur Prints
•	Block Print Collection
•	Artisan Collection
•	Ethnic Weaves
•	Traditional Handloom
Handicrafts Collection
•	Handmade Home Accessories
•	Decorative Items
•	Traditional Craft Collection
•	Gift Collection
Special Collections
•	New Arrivals
•	Best Sellers
•	Summer Collection
•	Winter Collection
•	Festive Collection
•	Wedding Collection
Bulk / Wholesale Orders
Target Customers:
•	Hotels
•	Resorts
•	Hospitals
•	Hostels
•	Retail Stores
•	Interior Designers
•	Corporate Gifting
STATIC PAGES
•	About Us
•	Contact Us
•	Privacy Policy
•	Terms and Conditions
•	Return Policy
•	Shipping Policy
CUSTOMER FEATURES
Authentication
•	Register
•	Login
•	Forgot Password
•	Reset Password
•	Email Verification
Profile
•	Edit Profile
•	Address Management
•	Order History
Shopping
•	Product Search
•	Category Filtering
•	Price Filtering
•	Add to Cart
•	Update Cart
•	Remove From Cart
•	Wishlist
•	Product Reviews
•	Product Ratings
Checkout
•	Address Selection
•	Razorpay Payment
•	Order Confirmation
•	Invoice Download
WHOLESALE FEATURES
Wholesale Inquiry Form
Fields:
•	Company Name
•	Contact Person
•	Email
•	Phone
•	Business Type
•	Product Interest
•	Quantity Requirement
•	Message
ADMIN PANEL REQUIREMENTS
Dashboard
Show:
•	Total Sales
•	Total Orders
•	Total Customers
•	Total Products
•	Revenue Analytics
Category Management
•	Create Category
•	Update Category
•	Delete Category
•	Nested Categories
Product Management
•	Add Product
•	Edit Product
•	Delete Product
•	Product Variants
•	Product Images
•	Stock Management
Order Management
•	View Orders
•	Update Status
Statuses:
•	Pending
•	Confirmed
•	Processing
•	Shipped
•	Delivered
•	Cancelled
Customer Management
•	View Customers
•	View Order History
Wholesale Management
•	View Inquiries
•	Export Inquiries
Coupon Management
•	Create Coupon
•	Expiry Date
•	Discount Rules
Banner Management
•	Homepage Banner
•	Category Banner
•	Promotional Banner
DATABASE SCHEMA
users
•	id
•	name
•	email
•	phone
•	password_hash
•	role
•	created_at
addresses
•	id
•	user_id
•	full_name
•	phone
•	address_line1
•	address_line2
•	city
•	state
•	pincode
•	country
categories
•	id
•	name
•	slug
•	parent_id
•	image
•	created_at
products
•	id
•	category_id
•	name
•	slug
•	short_description
•	description
•	sku
•	price
•	sale_price
•	stock
•	featured
•	best_seller
•	new_arrival
•	status
•	created_at
product_images
•	id
•	product_id
•	image_url
•	sort_order
product_variants
•	id
•	product_id
•	size
•	color
•	stock
•	price
carts
•	id
•	user_id
cart_items
•	id
•	cart_id
•	product_id
•	quantity
orders
•	id
•	user_id
•	order_number
•	total_amount
•	payment_status
•	order_status
•	created_at
order_items
•	id
•	order_id
•	product_id
•	variant_id
•	quantity
•	price
payments
•	id
•	order_id
•	razorpay_order_id
•	razorpay_payment_id
•	amount
•	status
wishlists
•	id
•	user_id
•	product_id
reviews
•	id
•	user_id
•	product_id
•	rating
•	review
coupons
•	id
•	code
•	discount_type
•	discount_value
•	start_date
•	end_date
wholesale_inquiries
•	id
•	company_name
•	contact_person
•	email
•	phone
•	business_type
•	product_interest
•	quantity_requirement
•	message
PRODUCT UPLOAD WORKFLOW
Admin Uploads Product
Step 1:
Enter Product Information
•	Product Name
•	Description
•	Category
•	SKU
•	Price
•	Sale Price
•	Stock
Step 2:
Upload Images
•	Upload to Cloudinary
•	Save URLs in product_images table
Step 3:
Create Variants
•	Size
•	Color
•	Stock
Step 4:
Publish Product
PAYMENT WORKFLOW
Customer
Add To Cart
→ Checkout
→ Address Selection
→ Create Razorpay Order
→ Complete Payment
→ Verify Signature
→ Create Order
→ Reduce Stock
→ Send Confirmation Email
→ Show Success Page
NON-FUNCTIONAL REQUIREMENTS
•	Mobile First
•	SEO Optimized
•	Fast Loading
•	Responsive Design
•	Accessibility Support
•	Image Optimization
•	Secure Authentication
•	SQL Injection Protection
•	Rate Limiting
•	Server Side Validation
•	Production Ready Code
DELIVERABLES
Generate:
1.	Complete MySQL schema
2.	Next.js folder structure
3.	Backend APIs
4.	Authentication system
5.	Admin dashboard
6.	Customer frontend
7.	Razorpay integration
8.	Cloudinary integration
9.	Database migrations
10.	Deployment guide for Ubuntu VPS
11.	Nginx configuration
12.	PM2 configuration
13.	Environment variables
14.	Docker setup
15.	Production checklist
Follow enterprise-level coding standards, TypeScript best practices, modular architecture, reusable components, and scalable database design.
PROJECT OVERVIEW
Build a complete production-ready premium textile and home furnishing e-commerce platform for "Bhavita Textiles".
Brand Positioning:
Handcrafted Home Textiles & Decor for Elegant Living
Alternative:
Premium Handloom, Home Furnishing & Handicrafts
TARGET USERS
1.	Retail Customers
2.	Wholesale/Bulk Buyers
3.	Interior Designers
4.	Hotels & Resorts
5.	Corporate Buyers
6.	Administrators
TECH STACK
Frontend:
•	Next.js 15 (App Router)
•	TypeScript
•	Tailwind CSS
•	ShadCN UI
•	React Query
•	Axios
Backend:
•	Next.js API Routes or Express.js
•	Node.js
•	JWT Authentication
•	Role Based Access Control
Database:
•	MySQL
Storage:
•	Cloudinary for product images
Payment Gateway:
•	Razorpay
Deployment:
•	Ubuntu VPS
•	Nginx
•	PM2
•	SSL
WEBSITE STRUCTURE
HOME
Sections:
•	Hero Banner
•	Featured Categories
•	New Arrivals
•	Best Sellers
•	Seasonal Collections
•	Handloom Heritage Collection
•	Testimonials
•	Brand Story
•	Wholesale CTA
•	Newsletter Subscription
SHOP
Bedroom Collection
Bedsheets
•	Cotton Bedsheets
•	Handloom Bedsheets
•	Printed Bedsheets
•	Premium Collection
•	King Size
•	Queen Size
•	Kids Collection
Blankets & Comforters
•	Cotton Blankets
•	Winter Blankets
•	AC Blankets
•	Quilts
•	Dohars
Pillows & Bedding Accessories
•	Pillow Covers
•	Cushion Covers
•	Bed Runners
Living Room Collection
Soft Furnishings
•	Sofa Throws
•	Sofa Covers
•	Cushion Covers
Curtains
•	Sheer Curtains
•	Blackout Curtains
•	Cotton Curtains
•	Printed Curtains
•	Luxury Curtains
Rugs & Carpets
•	Handwoven Rugs
•	Cotton Rugs
•	Floor Rugs
•	Area Rugs
•	Carpets
•	Runner Carpets
Door Mats
•	Cotton Door Mats
•	Anti Slip Mats
•	Decorative Mats
•	Outdoor Mats
Bath Collection
Towels
•	Bath Towels
•	Hand Towels
•	Face Towels
•	Luxury Towels
•	Hotel Towels
Bath Mats
Home Decor
•	Wall Decor
•	Table Linen
•	Decorative Textiles
•	Handmade Decor
•	Festive Decor
•	Cushion Styling Collection
Handloom Heritage Collection
•	Jaipur Prints
•	Block Print Collection
•	Artisan Collection
•	Ethnic Weaves
•	Traditional Handloom
Handicrafts Collection
•	Handmade Home Accessories
•	Decorative Items
•	Traditional Craft Collection
•	Gift Collection
Special Collections
•	New Arrivals
•	Best Sellers
•	Summer Collection
•	Winter Collection
•	Festive Collection
•	Wedding Collection
Bulk / Wholesale Orders
Target Customers:
•	Hotels
•	Resorts
•	Hospitals
•	Hostels
•	Retail Stores
•	Interior Designers
•	Corporate Gifting
STATIC PAGES
•	About Us
•	Contact Us
•	Privacy Policy
•	Terms and Conditions
•	Return Policy
•	Shipping Policy
CUSTOMER FEATURES
Authentication
•	Register
•	Login
•	Forgot Password
•	Reset Password
•	Email Verification
Profile
•	Edit Profile
•	Address Management
•	Order History
Shopping
•	Product Search
•	Category Filtering
•	Price Filtering
•	Add to Cart
•	Update Cart
•	Remove From Cart
•	Wishlist
•	Product Reviews
•	Product Ratings
Checkout
•	Address Selection
•	Razorpay Payment
•	Order Confirmation
•	Invoice Download
WHOLESALE FEATURES
Wholesale Inquiry Form
Fields:
•	Company Name
•	Contact Person
•	Email
•	Phone
•	Business Type
•	Product Interest
•	Quantity Requirement
•	Message
ADMIN PANEL REQUIREMENTS
Dashboard
Show:
•	Total Sales
•	Total Orders
•	Total Customers
•	Total Products
•	Revenue Analytics
Category Management
•	Create Category
•	Update Category
•	Delete Category
•	Nested Categories
Product Management
•	Add Product
•	Edit Product
•	Delete Product
•	Product Variants
•	Product Images
•	Stock Management
Order Management
•	View Orders
•	Update Status
Statuses:
•	Pending
•	Confirmed
•	Processing
•	Shipped
•	Delivered
•	Cancelled
Customer Management
•	View Customers
•	View Order History
Wholesale Management
•	View Inquiries
•	Export Inquiries
Coupon Management
•	Create Coupon
•	Expiry Date
•	Discount Rules
Banner Management
•	Homepage Banner
•	Category Banner
•	Promotional Banner
DATABASE SCHEMA
users
•	id
•	name
•	email
•	phone
•	password_hash
•	role
•	created_at
addresses
•	id
•	user_id
•	full_name
•	phone
•	address_line1
•	address_line2
•	city
•	state
•	pincode
•	country
categories
•	id
•	name
•	slug
•	parent_id
•	image
•	created_at
products
•	id
•	category_id
•	name
•	slug
•	short_description
•	description
•	sku
•	price
•	sale_price
•	stock
•	featured
•	best_seller
•	new_arrival
•	status
•	created_at
product_images
•	id
•	product_id
•	image_url
•	sort_order
product_variants
•	id
•	product_id
•	size
•	color
•	stock
•	price
carts
•	id
•	user_id
cart_items
•	id
•	cart_id
•	product_id
•	quantity
orders
•	id
•	user_id
•	order_number
•	total_amount
•	payment_status
•	order_status
•	created_at
order_items
•	id
•	order_id
•	product_id
•	variant_id
•	quantity
•	price
payments
•	id
•	order_id
•	razorpay_order_id
•	razorpay_payment_id
•	amount
•	status
wishlists
•	id
•	user_id
•	product_id
reviews
•	id
•	user_id
•	product_id
•	rating
•	review
coupons
•	id
•	code
•	discount_type
•	discount_value
•	start_date
•	end_date
wholesale_inquiries
•	id
•	company_name
•	contact_person
•	email
•	phone
•	business_type
•	product_interest
•	quantity_requirement
•	message
PRODUCT UPLOAD WORKFLOW
Admin Uploads Product
Step 1:
Enter Product Information
•	Product Name
•	Description
•	Category
•	SKU
•	Price
•	Sale Price
•	Stock
Step 2:
Upload Images
•	Upload to Cloudinary
•	Save URLs in product_images table
Step 3:
Create Variants
•	Size
•	Color
•	Stock
Step 4:
Publish Product
PAYMENT WORKFLOW
Customer
Add To Cart
→ Checkout
→ Address Selection
→ Create Razorpay Order
→ Complete Payment
→ Verify Signature
→ Create Order
→ Reduce Stock
→ Send Confirmation Email
→ Show Success Page
NON-FUNCTIONAL REQUIREMENTS
•	Mobile First
•	SEO Optimized
•	Fast Loading
•	Responsive Design
•	Accessibility Support
•	Image Optimization
•	Secure Authentication
•	SQL Injection Protection
•	Rate Limiting
•	Server Side Validation
•	Production Ready Code
DELIVERABLES
Generate:
1.	Complete MySQL schema
2.	Next.js folder structure
3.	Backend APIs
4.	Authentication system
5.	Admin dashboard
6.	Customer frontend
7.	Razorpay integration
8.	Cloudinary integration
9.	Database migrations
10.	Deployment guide for Ubuntu VPS
11.	Nginx configuration
12.	PM2 configuration
13.	Environment variables
14.	Docker setup
15.	Production checklist
Follow enterprise-level coding standards, TypeScript best practices, modular architecture, reusable components, and scalable database design.

