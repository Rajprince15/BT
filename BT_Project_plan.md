ROLE
You are a team consisting of:
â€¢	Senior Product Manager
â€¢	Senior UX/UI Designer
â€¢	Senior Full Stack Architect
â€¢	Senior Database Architect
â€¢	Senior Security Engineer
â€¢	Senior DevOps Engineer
â€¢	Senior E-commerce Consultant
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
â€¢	Role Based Access Control (RBAC)
â€¢	Super Admin
â€¢	Admin
â€¢	Customer
Requirements:
â€¢	Users must never be able to access admin pages by manually editing URLs.
â€¢	Users must never access another user's data.
â€¢	Users must never view another user's orders.
â€¢	Users must never modify order amounts.
â€¢	Users must never modify product prices from the frontend.
â€¢	Users must never modify stock quantities.
â€¢	Users must never access protected APIs without authentication.
â€¢	All permissions must be verified on the server.
Authentication:
â€¢	JWT Access Token
â€¢	Refresh Token Rotation
â€¢	Secure Logout
â€¢	Password Reset Flow
â€¢	Email Verification
â€¢	Session Expiration
Password Security:
â€¢	bcrypt hashing
â€¢	Strong password policies
â€¢	Password reset token expiry
API Security:
â€¢	Rate Limiting
â€¢	Request Validation
â€¢	Input Sanitization
â€¢	Output Encoding
â€¢	API Authorization Middleware
â€¢	Protected Routes
Protection Against:
â€¢	SQL Injection
â€¢	XSS
â€¢	CSRF
â€¢	SSRF
â€¢	Clickjacking
â€¢	Session Hijacking
â€¢	Broken Authentication
â€¢	Broken Access Control
â€¢	Directory Traversal
â€¢	File Upload Exploits
File Upload Security:
â€¢	Image MIME Validation
â€¢	File Size Limits
â€¢	Filename Sanitization
â€¢	Malware Scan Hook Support
â€¢	Cloudinary Upload Restrictions
Security Logging:
â€¢	Login Attempts
â€¢	Failed Logins
â€¢	Password Changes
â€¢	Admin Actions
â€¢	Product Updates
â€¢	Order Status Changes
Brand Style:
Luxury
Royal
Classic
Premium
Elegant
Timeless
Design Inspiration:
Luxury textile brands
Luxury home dÃ©cor brands
Premium furniture brands
Theme Requirements:
Light Theme
Dark Theme
Theme Switching:
â€¢	User controlled
â€¢	Saved in local storage
â€¢	Persist across sessions
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
â€¢	Order amount calculated only on backend.
â€¢	Cart validation before payment.
â€¢	Razorpay signature verification on backend.
â€¢	Order creation only after successful verification.
â€¢	Stock deduction only after payment confirmation.
â€¢	Prevent duplicate payments.
â€¢	Prevent replay attacks.
â€¢	Secure invoice generation.
==================================================
PRODUCTION DATABASE REQUIREMENTS
Design for future scaling.
Requirements:
â€¢	Proper Indexing
â€¢	Foreign Keys
â€¢	Database Constraints
â€¢	Soft Deletes
â€¢	Audit Tables
â€¢	Transaction Handling
â€¢	Rollback Strategy
Generate:
â€¢	Database Optimization Plan
â€¢	Query Optimization Plan
â€¢	Backup Strategy
==================================================
SEO REQUIREMENTS
Implement complete e-commerce SEO.
Requirements:
â€¢	Dynamic Meta Tags
â€¢	Open Graph Tags
â€¢	Twitter Cards
â€¢	Structured Data
â€¢	Product Schema
â€¢	Breadcrumb Schema
â€¢	XML Sitemap
â€¢	robots.txt
â€¢	Canonical URLs
Generate complete SEO architecture.
==================================================
PERFORMANCE REQUIREMENTS
Target:
â€¢	Lighthouse Score 90+
â€¢	Fast Mobile Experience
â€¢	Core Web Vitals Optimization
Implement:
â€¢	Image Optimization
â€¢	Lazy Loading
â€¢	Code Splitting
â€¢	Dynamic Imports
â€¢	Caching Strategy
â€¢	Database Query Optimization
â€¢	CDN Ready Assets
==================================================
LUXURY BRAND EXPERIENCE
The website should feel like a premium luxury brand.
Avoid:
â€¢	Generic ecommerce appearance
â€¢	Cheap templates
â€¢	Crowded layouts
â€¢	Excessive animations
Focus On:
â€¢	Premium Typography
â€¢	Elegant Layouts
â€¢	Luxury Visual Hierarchy
â€¢	High-End Product Presentation
â€¢	Immersive Product Pages
Design Inspiration:
Luxury Home Decor Brands
Luxury Textile Brands
Luxury Furniture Brands
==================================================
ADMIN EXPERIENCE
Admin dashboard should be enterprise-grade.
Features:
â€¢	Product Management
â€¢	Inventory Management
â€¢	Sales Analytics
â€¢	Revenue Reports
â€¢	Customer Insights
â€¢	Wholesale Inquiry Management

â€¢	Banner Management
â€¢	Review Moderation
Admin actions must be logged.
==================================================
MONITORING AND LOGGING
Generate:
â€¢	Error Logging Strategy
â€¢	Application Monitoring
â€¢	Audit Logging
â€¢	Payment Logs
â€¢	Security Logs
==================================================
BACKUP AND RECOVERY
Generate:
â€¢	Daily Database Backups
â€¢	Weekly Full Backups
â€¢	Media Backup Strategy
â€¢	Disaster Recovery Plan
==================================================
PRODUCTION DEPLOYMENT
Target Environment:
Development:
Windows Laptop
Production:
Ubuntu VPS
Generate:
â€¢	PM2 Setup
â€¢	Nginx Setup
â€¢	SSL Configuration
â€¢	Security Headers
â€¢	Firewall Rules
â€¢	Environment Variable Strategy
â€¢	Deployment Checklist
==================================================
QUALITY STANDARDS
Code must be:
â€¢	Production Ready
â€¢	Scalable
â€¢	Secure
â€¢	Modular
â€¢	Maintainable
â€¢	Well Documented
â€¢	Enterprise Grade
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
â€¢	Next.js 15 (App Router)
â€¢	TypeScript
â€¢	Tailwind CSS
â€¢	ShadCN UI
â€¢	React Query
â€¢	Axios
Backend:
â€¢	Next.js API Routes or Express.js
â€¢	Node.js
â€¢	JWT Authentication
â€¢	Role Based Access Control
Database:
â€¢	MySQL
Storage:
â€¢	Cloudinary for product images
Payment Gateway:
â€¢	Razorpay
Deployment:
â€¢	Ubuntu VPS
â€¢	Nginx
â€¢	PM2
â€¢	SSL
WEBSITE STRUCTURE
HOME
Sections:
â€¢	Hero Banner
â€¢	Featured Categories
â€¢	New Arrivals
â€¢	Best Sellers
â€¢	Seasonal Collections
â€¢	Handloom Heritage Collection
â€¢	Testimonials
â€¢	Brand Story
â€¢	Wholesale CTA
â€¢	Newsletter Subscription
SHOP
Bedroom Collection
Bedsheets
â€¢	Cotton Bedsheets
â€¢	Handloom Bedsheets
â€¢	Printed Bedsheets
â€¢	Premium Collection
â€¢	King Size
â€¢	Queen Size
â€¢	Kids Collection
Blankets & Comforters
â€¢	Cotton Blankets
â€¢	Winter Blankets
â€¢	AC Blankets
â€¢	Quilts
â€¢	Dohars
Pillows & Bedding Accessories
â€¢	Pillow Covers
â€¢	Cushion Covers
â€¢	Bed Runners
Living Room Collection
Soft Furnishings
â€¢	Sofa Throws
â€¢	Sofa Covers
â€¢	Cushion Covers
Curtains
â€¢	Sheer Curtains
â€¢	Blackout Curtains
â€¢	Cotton Curtains
â€¢	Printed Curtains
â€¢	Luxury Curtains
Rugs & Carpets
â€¢	Handwoven Rugs
â€¢	Cotton Rugs
â€¢	Floor Rugs
â€¢	Area Rugs
â€¢	Carpets
â€¢	Runner Carpets
Door Mats
â€¢	Cotton Door Mats
â€¢	Anti Slip Mats
â€¢	Decorative Mats
â€¢	Outdoor Mats
Bath Collection
Towels
â€¢	Bath Towels
â€¢	Hand Towels
â€¢	Face Towels
â€¢	Luxury Towels
â€¢	Hotel Towels
Bath Mats
Home Decor
â€¢	Wall Decor
â€¢	Table Linen
â€¢	Decorative Textiles
â€¢	Handmade Decor
â€¢	Festive Decor
â€¢	Cushion Styling Collection
Handloom Heritage Collection
â€¢	Jaipur Prints
â€¢	Block Print Collection
â€¢	Artisan Collection
â€¢	Ethnic Weaves
â€¢	Traditional Handloom
Handicrafts Collection
â€¢	Handmade Home Accessories
â€¢	Decorative Items
â€¢	Traditional Craft Collection
â€¢	Gift Collection
Special Collections
â€¢	New Arrivals
â€¢	Best Sellers
â€¢	Summer Collection
â€¢	Winter Collection
â€¢	Festive Collection
â€¢	Wedding Collection
Bulk / Wholesale Orders
Target Customers:
â€¢	Hotels
â€¢	Resorts
â€¢	Hospitals
â€¢	Hostels
â€¢	Retail Stores
â€¢	Interior Designers
â€¢	Corporate Gifting
STATIC PAGES
â€¢	About Us
â€¢	Contact Us
â€¢	Privacy Policy
â€¢	Terms and Conditions
â€¢	Return Policy
â€¢	Shipping Policy
CUSTOMER FEATURES
Authentication
â€¢	Register
â€¢	Login
â€¢	Forgot Password
â€¢	Reset Password
â€¢	Email Verification
Profile
â€¢	Edit Profile
â€¢	Address Management
â€¢	Order History
Shopping
â€¢	Product Search
â€¢	Category Filtering
â€¢	Price Filtering
â€¢	Add to Cart
â€¢	Update Cart
â€¢	Remove From Cart
â€¢	Wishlist
â€¢	Product Reviews
â€¢	Product Ratings
Checkout
â€¢	Address Selection
â€¢	Razorpay Payment
â€¢	Order Confirmation
â€¢	Invoice Download
WHOLESALE FEATURES
Wholesale Inquiry Form
Fields:
â€¢	Company Name
â€¢	Contact Person
â€¢	Email
â€¢	Phone
â€¢	Business Type
â€¢	Product Interest
â€¢	Quantity Requirement
â€¢	Message
ADMIN PANEL REQUIREMENTS
Dashboard
Show:
â€¢	Total Sales
â€¢	Total Orders
â€¢	Total Customers
â€¢	Total Products
â€¢	Revenue Analytics
Category Management
â€¢	Create Category
â€¢	Update Category
â€¢	Delete Category
â€¢	Nested Categories
Product Management
â€¢	Add Product
â€¢	Edit Product
â€¢	Delete Product
â€¢	Product Variants
â€¢	Product Images
â€¢	Stock Management
Order Management
â€¢	View Orders
â€¢	Update Status
Statuses:
â€¢	Pending
â€¢	Confirmed
â€¢	Processing
â€¢	Shipped
â€¢	Delivered
â€¢	Cancelled
Customer Management
â€¢	View Customers
â€¢	View Order History
Wholesale Management
â€¢	View Inquiries
â€¢	Export Inquiries
Banner Management
â€¢	Homepage Banner
â€¢	Category Banner
â€¢	Promotional Banner
DATABASE SCHEMA
users
â€¢	id
â€¢	name
â€¢	email
â€¢	phone
â€¢	password_hash
â€¢	role
â€¢	created_at
addresses
â€¢	id
â€¢	user_id
â€¢	full_name
â€¢	phone
â€¢	address_line1
â€¢	address_line2
â€¢	city
â€¢	state
â€¢	pincode
â€¢	country
categories
â€¢	id
â€¢	name
â€¢	slug
â€¢	parent_id
â€¢	image
â€¢	created_at
products
â€¢	id
â€¢	category_id
â€¢	name
â€¢	slug
â€¢	short_description
â€¢	description
â€¢	sku
â€¢	price
â€¢	sale_price
â€¢	stock
â€¢	featured
â€¢	best_seller
â€¢	new_arrival
â€¢	status
â€¢	created_at
product_images
â€¢	id
â€¢	product_id
â€¢	image_url
â€¢	sort_order
product_variants
â€¢	id
â€¢	product_id
â€¢	size
â€¢	color
â€¢	stock
â€¢	price
carts
â€¢	id
â€¢	user_id
cart_items
â€¢	id
â€¢	cart_id
â€¢	product_id
â€¢	quantity
orders
â€¢	id
â€¢	user_id
â€¢	order_number
â€¢	total_amount
â€¢	payment_status
â€¢	order_status
â€¢	created_at
order_items
â€¢	id
â€¢	order_id
â€¢	product_id
â€¢	variant_id
â€¢	quantity
â€¢	price
payments
â€¢	id
â€¢	order_id
â€¢	razorpay_order_id
â€¢	razorpay_payment_id
â€¢	amount
â€¢	status
wishlists
â€¢	id
â€¢	user_id
â€¢	product_id
reviews
â€¢	id
â€¢	user_id
â€¢	product_id
â€¢	rating
â€¢	review
wholesale_inquiries
â€¢	id
â€¢	company_name
â€¢	contact_person
â€¢	email
â€¢	phone
â€¢	business_type
â€¢	product_interest
â€¢	quantity_requirement
â€¢	message
PRODUCT UPLOAD WORKFLOW
Admin Uploads Product
Step 1:
Enter Product Information
â€¢	Product Name
â€¢	Description
â€¢	Category
â€¢	SKU
â€¢	Price
â€¢	Sale Price
â€¢	Stock
Step 2:
Upload Images
â€¢	Upload to Cloudinary
â€¢	Save URLs in product_images table
Step 3:
Create Variants
â€¢	Size
â€¢	Color
â€¢	Stock
Step 4:
Publish Product
PAYMENT WORKFLOW
Customer
Add To Cart
â†’ Checkout
â†’ Address Selection
â†’ Create Razorpay Order
â†’ Complete Payment
â†’ Verify Signature
â†’ Create Order
â†’ Reduce Stock
â†’ Send Confirmation Email
â†’ Show Success Page
NON-FUNCTIONAL REQUIREMENTS
â€¢	Mobile First
â€¢	SEO Optimized
â€¢	Fast Loading
â€¢	Responsive Design
â€¢	Accessibility Support
â€¢	Image Optimization
â€¢	Secure Authentication
â€¢	SQL Injection Protection
â€¢	Rate Limiting
â€¢	Server Side Validation
â€¢	Production Ready Code
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
â€¢	Next.js 15 (App Router)
â€¢	TypeScript
â€¢	Tailwind CSS
â€¢	ShadCN UI
â€¢	React Query
â€¢	Axios
Backend:
â€¢	Next.js API Routes or Express.js
â€¢	Node.js
â€¢	JWT Authentication
â€¢	Role Based Access Control
Database:
â€¢	MySQL
Storage:
â€¢	Cloudinary for product images
Payment Gateway:
â€¢	Razorpay
Deployment:
â€¢	Ubuntu VPS
â€¢	Nginx
â€¢	PM2
â€¢	SSL
WEBSITE STRUCTURE
HOME
Sections:
â€¢	Hero Banner
â€¢	Featured Categories
â€¢	New Arrivals
â€¢	Best Sellers
â€¢	Seasonal Collections
â€¢	Handloom Heritage Collection
â€¢	Testimonials
â€¢	Brand Story
â€¢	Wholesale CTA
â€¢	Newsletter Subscription
SHOP
Bedroom Collection
Bedsheets
â€¢	Cotton Bedsheets
â€¢	Handloom Bedsheets
â€¢	Printed Bedsheets
â€¢	Premium Collection
â€¢	King Size
â€¢	Queen Size
â€¢	Kids Collection
Blankets & Comforters
â€¢	Cotton Blankets
â€¢	Winter Blankets
â€¢	AC Blankets
â€¢	Quilts
â€¢	Dohars
Pillows & Bedding Accessories
â€¢	Pillow Covers
â€¢	Cushion Covers
â€¢	Bed Runners
Living Room Collection
Soft Furnishings
â€¢	Sofa Throws
â€¢	Sofa Covers
â€¢	Cushion Covers
Curtains
â€¢	Sheer Curtains
â€¢	Blackout Curtains
â€¢	Cotton Curtains
â€¢	Printed Curtains
â€¢	Luxury Curtains
Rugs & Carpets
â€¢	Handwoven Rugs
â€¢	Cotton Rugs
â€¢	Floor Rugs
â€¢	Area Rugs
â€¢	Carpets
â€¢	Runner Carpets
Door Mats
â€¢	Cotton Door Mats
â€¢	Anti Slip Mats
â€¢	Decorative Mats
â€¢	Outdoor Mats
Bath Collection
Towels
â€¢	Bath Towels
â€¢	Hand Towels
â€¢	Face Towels
â€¢	Luxury Towels
â€¢	Hotel Towels
Bath Mats
Home Decor
â€¢	Wall Decor
â€¢	Table Linen
â€¢	Decorative Textiles
â€¢	Handmade Decor
â€¢	Festive Decor
â€¢	Cushion Styling Collection
Handloom Heritage Collection
â€¢	Jaipur Prints
â€¢	Block Print Collection
â€¢	Artisan Collection
â€¢	Ethnic Weaves
â€¢	Traditional Handloom
Handicrafts Collection
â€¢	Handmade Home Accessories
â€¢	Decorative Items
â€¢	Traditional Craft Collection
â€¢	Gift Collection
Special Collections
â€¢	New Arrivals
â€¢	Best Sellers
â€¢	Summer Collection
â€¢	Winter Collection
â€¢	Festive Collection
â€¢	Wedding Collection
Bulk / Wholesale Orders
Target Customers:
â€¢	Hotels
â€¢	Resorts
â€¢	Hospitals
â€¢	Hostels
â€¢	Retail Stores
â€¢	Interior Designers
â€¢	Corporate Gifting
STATIC PAGES
â€¢	About Us
â€¢	Contact Us
â€¢	Privacy Policy
â€¢	Terms and Conditions
â€¢	Return Policy
â€¢	Shipping Policy
CUSTOMER FEATURES
Authentication
â€¢	Register
â€¢	Login
â€¢	Forgot Password
â€¢	Reset Password
â€¢	Email Verification
Profile
â€¢	Edit Profile
â€¢	Address Management
â€¢	Order History
Shopping
â€¢	Product Search
â€¢	Category Filtering
â€¢	Price Filtering
â€¢	Add to Cart
â€¢	Update Cart
â€¢	Remove From Cart
â€¢	Wishlist
â€¢	Product Reviews
â€¢	Product Ratings
Checkout
â€¢	Address Selection
â€¢	Razorpay Payment
â€¢	Order Confirmation
â€¢	Invoice Download
WHOLESALE FEATURES
Wholesale Inquiry Form
Fields:
â€¢	Company Name
â€¢	Contact Person
â€¢	Email
â€¢	Phone
â€¢	Business Type
â€¢	Product Interest
â€¢	Quantity Requirement
â€¢	Message
ADMIN PANEL REQUIREMENTS
Dashboard
Show:
â€¢	Total Sales
â€¢	Total Orders
â€¢	Total Customers
â€¢	Total Products
â€¢	Revenue Analytics
Category Management
â€¢	Create Category
â€¢	Update Category
â€¢	Delete Category
â€¢	Nested Categories
Product Management
â€¢	Add Product
â€¢	Edit Product
â€¢	Delete Product
â€¢	Product Variants
â€¢	Product Images
â€¢	Stock Management
Order Management
â€¢	View Orders
â€¢	Update Status
Statuses:
â€¢	Pending
â€¢	Confirmed
â€¢	Processing
â€¢	Shipped
â€¢	Delivered
â€¢	Cancelled
Customer Management
â€¢	View Customers
â€¢	View Order History
Wholesale Management
â€¢	View Inquiries
â€¢	Export Inquiries
Banner Management
â€¢	Homepage Banner
â€¢	Category Banner
â€¢	Promotional Banner
DATABASE SCHEMA
users
â€¢	id
â€¢	name
â€¢	email
â€¢	phone
â€¢	password_hash
â€¢	role
â€¢	created_at
addresses
â€¢	id
â€¢	user_id
â€¢	full_name
â€¢	phone
â€¢	address_line1
â€¢	address_line2
â€¢	city
â€¢	state
â€¢	pincode
â€¢	country
categories
â€¢	id
â€¢	name
â€¢	slug
â€¢	parent_id
â€¢	image
â€¢	created_at
products
â€¢	id
â€¢	category_id
â€¢	name
â€¢	slug
â€¢	short_description
â€¢	description
â€¢	sku
â€¢	price
â€¢	sale_price
â€¢	stock
â€¢	featured
â€¢	best_seller
â€¢	new_arrival
â€¢	status
â€¢	created_at
product_images
â€¢	id
â€¢	product_id
â€¢	image_url
â€¢	sort_order
product_variants
â€¢	id
â€¢	product_id
â€¢	size
â€¢	color
â€¢	stock
â€¢	price
carts
â€¢	id
â€¢	user_id
cart_items
â€¢	id
â€¢	cart_id
â€¢	product_id
â€¢	quantity
orders
â€¢	id
â€¢	user_id
â€¢	order_number
â€¢	total_amount
â€¢	payment_status
â€¢	order_status
â€¢	created_at
order_items
â€¢	id
â€¢	order_id
â€¢	product_id
â€¢	variant_id
â€¢	quantity
â€¢	price
payments
â€¢	id
â€¢	order_id
â€¢	razorpay_order_id
â€¢	razorpay_payment_id
â€¢	amount
â€¢	status
wishlists
â€¢	id
â€¢	user_id
â€¢	product_id
reviews
â€¢	id
â€¢	user_id
â€¢	product_id
â€¢	rating
â€¢	review
wholesale_inquiries
â€¢	id
â€¢	company_name
â€¢	contact_person
â€¢	email
â€¢	phone
â€¢	business_type
â€¢	product_interest
â€¢	quantity_requirement
â€¢	message
PRODUCT UPLOAD WORKFLOW
Admin Uploads Product
Step 1:
Enter Product Information
â€¢	Product Name
â€¢	Description
â€¢	Category
â€¢	SKU
â€¢	Price
â€¢	Sale Price
â€¢	Stock
Step 2:
Upload Images
â€¢	Upload to Cloudinary
â€¢	Save URLs in product_images table
Step 3:
Create Variants
â€¢	Size
â€¢	Color
â€¢	Stock
Step 4:
Publish Product
PAYMENT WORKFLOW
Customer
Add To Cart
â†’ Checkout
â†’ Address Selection
â†’ Create Razorpay Order
â†’ Complete Payment
â†’ Verify Signature
â†’ Create Order
â†’ Reduce Stock
â†’ Send Confirmation Email
â†’ Show Success Page
NON-FUNCTIONAL REQUIREMENTS
â€¢	Mobile First
â€¢	SEO Optimized
â€¢	Fast Loading
â€¢	Responsive Design
â€¢	Accessibility Support
â€¢	Image Optimization
â€¢	Secure Authentication
â€¢	SQL Injection Protection
â€¢	Rate Limiting
â€¢	Server Side Validation
â€¢	Production Ready Code
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



