# 🌱 EcoFinds - Sustainable Second-Hand Marketplace

<div align="center">
  <img src="public/logo.svg" alt="EcoFinds Logo" width="120" height="120">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  **Your Go-To Platform for Sustainable Second-Hand Shopping**
  
  [🚀 Live Demo](https://eco-finds.vercel.app) · [📖 Documentation](#documentation) · [🐛 Report Bug](#issues) · [✨ Request Feature](#contributing)
</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [💡 Usage](#-usage)
- [🎨 UI Components](#-ui-components)
- [🔐 Authentication](#-authentication)
- [💳 Payment Integration](#-payment-integration)
- [🤖 AI Features](#-ai-features)
- [📱 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Features

### 🛒 **Marketplace Core**
- **Browse & Search**: Discover thousands of second-hand items
- **Advanced Filtering**: Filter by category, price, condition, location
- **AI-Powered Recommendations**: Smart suggestions based on your preferences
- **Wishlist & Favorites**: Save items for later

### 👥 **User Management**
- **Dual Role System**: Buy and sell on the same platform
- **Profile Management**: Comprehensive user profiles with business details
- **Dashboard Analytics**: Track sales, orders, and revenue
- **Review System**: Rate and review sellers and products

### 💰 **E-Commerce Features**
- **Shopping Cart**: Add multiple items and manage quantities
- **Secure Checkout**: Seamless payment processing
- **Order Management**: Track orders from purchase to delivery
- **Payment Integration**: Razorpay payment gateway

### 🎯 **Seller Tools**
- **Product Management**: Easy listing creation with image uploads
- **Inventory Tracking**: Real-time stock management
- **Order Fulfillment**: Manage incoming orders and deliveries
- **Revenue Analytics**: Detailed sales reports and insights

### 🤖 **AI & Smart Features**
- **AI Recommendations**: Gemini-powered product suggestions
- **Smart Search**: Intelligent search with fuzzy matching
- **Price Optimization**: Market-based pricing suggestions
- **Trend Analysis**: Popular categories and demand insights

### 🌱 **Sustainability Focus**
- **Eco-Friendly**: Promote reuse and reduce waste
- **Carbon Footprint**: Track environmental impact
- **Sustainability Metrics**: Measure waste reduction
- **Green Initiatives**: Partner with eco-conscious brands

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks

### **Backend**
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: Cookie-based sessions
- **File Upload**: Cloudinary

### **Payment & Services**
- **Payment Gateway**: Razorpay
- **AI Service**: Google Gemini 2.0 Flash
- **Image Storage**: Cloudinary
- **Email Service**: Ready for integration
- **Analytics**: Built-in dashboard

### **Development & Deployment**
- **Package Manager**: npm
- **Bundler**: Turbopack (Next.js)
- **Deployment**: Vercel (recommended)
- **Version Control**: Git
- **Environment**: .env.local configuration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account
- **Cloudinary** account
- **Razorpay** account
- **Google AI** API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Parthsawant1298/odoo_eco_finds.git
cd eco-finds
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
eco-finds/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 auth/                 # Authentication endpoints
│   │   ├── 📁 cart/                 # Shopping cart operations
│   │   ├── 📁 order/                # Order management
│   │   ├── 📁 payment/              # Payment processing
│   │   ├── 📁 rawmaterials/         # Product management
│   │   ├── 📁 reviews/              # Review system
│   │   └── 📁 user/                 # User operations
│   ├── 📁 (pages)/                  # Application pages
│   │   ├── 📄 page.js               # Homepage
│   │   ├── 📁 dashboard/            # User dashboard
│   │   ├── 📁 rawmaterials/         # Product pages
│   │   ├── 📁 cart/                 # Shopping cart
│   │   ├── 📁 checkout/             # Checkout process
│   │   └── ...                      # Other pages
│   ├── 📄 layout.js                 # Root layout
│   ├── 📄 globals.css               # Global styles
│   └── 📄 favicon.ico               # App icon
├── 📁 components/                   # Reusable components
│   ├── 📄 Header.jsx                # Navigation header
│   ├── 📄 Footer.jsx                # Site footer
│   ├── 📄 Hero.jsx                  # Landing hero section
│   ├── 📄 Login.jsx                 # Login form
│   ├── 📄 Register.jsx              # Registration form
│   ├── 📄 Cart.jsx                  # Shopping cart
│   ├── 📄 DashboardAnalytics.jsx    # Analytics dashboard
│   └── ...                          # Other components
├── 📁 lib/                          # Utility libraries
│   ├── 📄 mongodb.js                # Database connection
│   └── 📄 aiRecommendation.js       # AI recommendation engine
├── 📁 models/                       # Database models
│   ├── 📄 user.js                   # User schema
│   ├── 📄 rawMaterial.js            # Product schema
│   ├── 📄 order.js                  # Order schema
│   ├── 📄 cart.js                   # Cart schema
│   └── 📄 review.js                 # Review schema
├── 📁 public/                       # Static assets
│   ├── 📄 logo.svg                  # App logo
│   └── ...                          # Other static files
├── 📄 package.json                  # Dependencies
├── 📄 tailwind.config.js            # Tailwind configuration
├── 📄 next.config.mjs               # Next.js configuration
└── 📄 README.md                     # This file
```

---

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay key ID | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |

### **Database Setup**

1. **Create MongoDB Atlas cluster**
2. **Add IP to whitelist** (0.0.0.0/0 for development)
3. **Create database user**
4. **Copy connection string**

### **Cloudinary Setup**

1. **Create Cloudinary account**
2. **Get cloud name, API key, and secret**
3. **Configure upload presets** (optional)

### **Razorpay Setup**

1. **Create Razorpay account**
2. **Generate API keys**
3. **Configure webhooks** (optional)

---

## 💡 Usage

### **For Buyers**

1. **Browse Products**
   - Visit the homepage
   - Use search and filters
   - View product details

2. **Add to Cart**
   - Select quantity
   - Add multiple items
   - Proceed to checkout

3. **Place Order**
   - Fill shipping details
   - Select payment method
   - Complete payment

4. **Track Orders**
   - View order history
   - Track delivery status
   - Leave reviews

### **For Sellers**

1. **Create Account**
   - Register as seller
   - Complete profile setup
   - Add business details

2. **List Products**
   - Add product details
   - Upload images
   - Set pricing

3. **Manage Orders**
   - View incoming orders
   - Update order status
   - Track performance

4. **Analytics**
   - View sales reports
   - Track revenue
   - Monitor reviews

---

## 🎨 UI Components

### **Core Components**

- **Header**: Navigation with user menu
- **Footer**: Site links and information
- **Hero**: Landing page banner
- **ProductCard**: Product display component
- **SearchBar**: Product search interface
- **FilterPanel**: Advanced filtering options

### **Forms**

- **LoginForm**: User authentication
- **RegisterForm**: Account creation
- **ProductForm**: Product listing
- **CheckoutForm**: Order placement
- **ReviewForm**: Product reviews

### **Dashboard**

- **Analytics**: Sales and performance metrics
- **OrderManagement**: Order tracking and updates
- **ProductManagement**: Inventory management
- **UserProfile**: Account settings

---

## 🔐 Authentication

### **Features**

- **Cookie-based sessions**: Secure, HttpOnly cookies
- **Password hashing**: bcryptjs encryption
- **Auto-login**: Seamless registration flow
- **Protected routes**: Middleware protection

### **User Roles**

- **Buyer**: Purchase products, leave reviews
- **Seller**: List products, manage orders
- **Admin**: Platform management (future)

### **Security**

- **Input validation**: Server-side validation
- **CSRF protection**: SameSite cookies
- **Rate limiting**: API protection (recommended)
- **Data sanitization**: MongoDB injection prevention

---

## 💳 Payment Integration

### **Razorpay Features**

- **Multiple payment methods**: Cards, UPI, wallets, net banking
- **Secure processing**: PCI DSS compliant
- **Real-time verification**: Payment confirmation
- **Refund support**: Automated refund processing

### **Payment Flow**

1. **Order creation**: Generate Razorpay order
2. **Payment collection**: Frontend payment form
3. **Verification**: Backend signature verification
4. **Order confirmation**: Database update
5. **Email notification**: Order confirmation (future)

---

## 🤖 AI Features

### **Recommendation Engine**

- **Gemini 2.0 Flash**: Advanced AI model
- **Smart matching**: Product similarity analysis
- **User preferences**: Personalized suggestions
- **Search enhancement**: Intelligent search results

### **AI Capabilities**

- **Natural language processing**: Search query understanding
- **Product categorization**: Automatic tagging
- **Price optimization**: Market analysis
- **Trend prediction**: Demand forecasting

---

## 📱 API Reference

### **Authentication**

```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register
POST /api/auth/register
{
  "username": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

// Logout
POST /api/auth/logout
```

### **Products**

```javascript
// Get all products
GET /api/rawmaterials/available

// Get product by ID
GET /api/rawmaterials/[id]

// Create product
POST /api/user/rawmaterials
{
  "name": "Product Name",
  "description": "Product description",
  "price": 100,
  "quantity": 10,
  "category": "Electronics",
  "images": ["image1.jpg", "image2.jpg"]
}
```

### **Cart & Orders**

```javascript
// Add to cart
POST /api/cart
{
  "rawMaterialId": "product_id",
  "quantity": 2
}

// Create order
POST /api/order
{
  "items": [...],
  "shippingAddress": {...}
}

// Get order history
GET /api/order/history
```

---

## 🧪 Testing

### **Manual Testing**

1. **User registration and login**
2. **Product listing and browsing**
3. **Cart functionality**
4. **Order placement**
5. **Payment processing**
6. **Dashboard features**

### **API Testing**

```bash
# Using curl or Postman
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Database Testing**

- **Connection verification**
- **CRUD operations**
- **Data validation**
- **Index performance**

---

## 🚀 Deployment

### **Vercel Deployment** (Recommended)

1. **Connect GitHub repository**
2. **Configure environment variables**
3. **Deploy automatically**

```bash
npm run build
npm start
```

### **Other Platforms**

- **Netlify**: Static export mode
- **Heroku**: Container deployment
- **DigitalOcean**: Droplet deployment
- **AWS**: EC2 or Amplify

### **Environment Setup**

```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database (production)
MONGODB_URI=mongodb+srv://prod-connection-string

# Services (production keys)
RAZORPAY_KEY_ID=prod_key
CLOUDINARY_CLOUD_NAME=prod_cloud
```

---

## 🤝 Contributing

### **How to Contribute**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Guidelines**

- **Code Style**: Follow existing patterns
- **Comments**: Document complex logic
- **Testing**: Test new features thoroughly
- **Performance**: Optimize for speed and SEO

### **Areas for Contribution**

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation**
- 🎨 **UI/UX improvements**
- ⚡ **Performance optimization**
- 🧪 **Testing**

---

## 📞 Support

### **Get Help**

- 📧 **Email**: parthsawant1298@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Parthsawant1298/odoo_eco_finds/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Parthsawant1298/odoo_eco_finds/discussions)

### **Documentation**

- 📖 **API Docs**: `/api` endpoints
- 🎨 **Component Docs**: `/components` folder
- 🗂️ **Database Schema**: `/models` folder

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team**: Amazing framework
- **Vercel**: Hosting and deployment
- **MongoDB**: Database solution
- **Cloudinary**: Image management
- **Razorpay**: Payment processing
- **Google**: AI services
- **Open Source Community**: Inspiration and tools

---

<div align="center">
  
  **Made with ❤️ by [Parth Sawant](https://github.com/Parthsawant1298)**
  
  ⭐ **Star this repo if you found it helpful!**
  
  [🔗 Live Demo](https://eco-finds.vercel.app) | [🐛 Report Bug](https://github.com/Parthsawant1298/odoo_eco_finds/issues) | [✨ Request Feature](https://github.com/Parthsawant1298/odoo_eco_finds/issues)

</div>
