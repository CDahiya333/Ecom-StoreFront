
# 🏰 Maison Élégance - Luxury Home Decor E-Commerce Store

**Maison Élégance** is a modern, full-stack e-commerce platform that specializes in luxury home decor and furniture. It offers a premium shopping experience with an elegant design, advanced user features, real-time admin controls, and integrated AI chat assistance powered by native LLM support.

> 🟢 **Live Demo:** <a href="https://ecom-storefront.onrender.com/" target="_blank">Visit the Storefront →</a>

## ScreenShots:
<img width="1217" alt="Screenshot 2025-04-16 at 2 10 59 PM" src="https://github.com/user-attachments/assets/cbc34287-9ad3-4e76-a092-be6c0343c7d1" />
<img width="1394" alt="Screenshot 2025-04-16 at 9 02 55 PM" src="https://github.com/user-attachments/assets/50516281-b36f-4a2f-94d7-704c1972313f" />
<img width="1217" alt="Screenshot 2025-04-16 at 2 11 07 PM" src="https://github.com/user-attachments/assets/843d377b-7ad6-4fe3-b839-4dcf30e0f403" />
<img width="1217" alt="Screenshot 2025-04-16 at 2 11 23 PM" src="https://github.com/user-attachments/assets/6070c616-d3c4-4c16-8f97-40f2e41ac974" />
<img width="696" alt="Screenshot 2025-04-17 at 1 40 20 AM" src="https://github.com/user-attachments/assets/c7fffcc7-b1c9-4957-8237-9caaf8885cf9" />
<img width="1425" alt="CategoryPage" src="https://github.com/user-attachments/assets/ff69c753-a688-48d7-b514-e78fe8fb932d" />
<img width="1425" alt="Cart" src="https://github.com/user-attachments/assets/ca62f9a4-bd1a-4b56-88cb-755d8174823a" />
<img width="1425" alt="Recommendations" src="https://github.com/user-attachments/assets/86f690f7-d7de-4a69-b0b7-9e59bd8867d1" />
<img width="1021" alt="StripeGateWay" src="https://github.com/user-attachments/assets/3a6bb802-cd3c-49b7-bb7d-4983c5a6184a" />
<img width="715" alt="Screenshot 2025-04-17 at 3 52 43 AM" src="https://github.com/user-attachments/assets/5231b5f6-27e4-4ee2-beee-d0591684d2db" />
<img width="1355" alt="Screenshot 2025-04-17 at 3 53 14 AM" src="https://github.com/user-attachments/assets/07ebfe2f-c1f6-4231-8245-c65542f
7ba70" />
<img width="1429" alt="Screenshot 2025-04-17 at 3 52 59 AM" src="https://github.com/user-attachments/assets/bb011094-0258-40d9-9b83-9885a36b08a5" />
<img width="1425" alt="Footer" src="https://github.com/user-attachments/assets/3ecea2cd-d6c8-48a4-a2ca-1bf8a093716f" />

## ✨ Features

### 🛍️ Customer-Facing Features

#### 🏠 Homepage
- **Hero Section** featuring curated collections  
- **Elegant Product Categories** with hover animations  
- **Featured Products Carousel**  
- **Product of the Week** spotlight  
- **Interior Design Blog**  
- **Customer Testimonials**  
- **Newsletter Subscription**

#### 🛒 Product Experience
- **Advanced Filtering Options** by:
  - Category
  - Price range
  - Style
  - Material
- **Interactive Product Cards** with:
  - Quick view
  - Add to cart / wishlist / favorites
  - Hover effects
  - Pricing and details

#### 🛍️ Shopping Features
- **Smart Cart Management**
  - Real-time cart updates
  - Item quantity adjustment
  - Item removal
  - Auto price calculations
- **Wishlist & Favorites**
- **Secure Checkout Process**

#### 👤 User Account
- **Authentication**
  - Email/password login
  - Social media login options
- **Profile Management**
  - View order history
  - Manage addresses and payment methods
  - Save personal preferences

---

### 👑 Admin Dashboard

#### 🧾 Product Management
- **Create, Edit, and Delete Products**
- **Feature Toggle**: Mark/unmark products as featured on the homepage
- **Bulk Upload and Image Gallery Management** via Cloudinary

#### 📦 Order Management
- View and update orders  
- Track order status and process refunds  
- Generate invoices

#### 📊 Analytics Dashboard
- Visual Analytics Tabs with:
  - Number of users
  - Total sales
  - Timing of sales in the last 7 days (visual charts)
- Popular products and trends

#### 📝 Content Management
- Manage blog content (create, edit, schedule)  
- Modify testimonials and featured content on homepage

---

### 🤖 AI Chat Assistance

Maison Élégance includes **AI Chat Assistance** powered by native LLM support to help users:
- Discover products  
- Get decor suggestions  
- Answer FAQs  
- Guide through checkout

---

## 🎨 Design & UX

### Responsive Design
- **Mobile-first** experience  
- Tablet and desktop optimization  
- Smooth layout transitions across screen sizes

### Modern UI Elements
- Tailwind CSS components  
- Framer Motion animations  
- Subtle micro-interactions and hover effects  
- Animated buttons and loading states

### Performance Optimizations
- Lazy loading of images  
- Component-level code splitting  
- Smart caching strategies

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Zustand (State Management)
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Cloud Services
- MongoDB Atlas (Cloud Database)  
- Cloudinary (Image Hosting & Optimization)

---

## 📱 Mobile Responsiveness

Maison Élégance provides a consistent experience across devices:
- **Mobile**: < 640px  
- **Tablet**: 640px – 1024px  
- **Desktop**: > 1024px

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone [repository-url]
2. Install dependencies
bash
Copy
Edit
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
3. Configure environment variables
Frontend .env
env
Copy
Edit
REACT_APP_API_URL=your_api_url
REACT_APP_CLOUDINARY_URL=your_cloudinary_url
Backend .env
env
Copy
Edit
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
4. Run the development servers
bash
Copy
Edit
# Frontend
npm run dev

# Backend
npm run dev
```
Currently there is no admin registration route so in order to try it out.
email: john@gmail.com
password:123456

🤝 Contributing
We welcome contributions! Please refer to our contributing guidelines for more information.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

🧑‍💻 Developed by Chirag Dahiya
