# Fast Delivery (Bilariyaganj) 🚀

A modern, fast, hyper-local daily essentials ordering platform built with **Next.js (App Router)**, **Tailwind CSS**, and **Lucide React**.

Designed according to the high-converting landing page reference for Bilariyaganj, Uttar Pradesh.

---

## 🌟 Workflow Overview
1. **No Complex Shop Registration**: The store operates as a single direct shop where the admin manages the catalogue.
2. **Customer Places Order**: Customer adds daily essentials (Sugar, Milk, Basmati Rice, Oil, Wheat Flour, etc.) to the cart.
3. **Admin Receives Order**: Order details (Customer Name, Mobile Number, Bilariyaganj Delivery Address, Items List, and Total Amount) are sent directly to the Admin's registered WhatsApp/Phone number.
4. **Local Delivery Partner Dispatched**: Admin calls the local delivery boy and assigns the order for fast doorstep delivery.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS with custom brand colors & responsive typography
- **Icons:** Lucide React
- **Language:** TypeScript

---

## 🚀 How to Run the Project

### 1. Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📁 Project Structure
```
fast-delivery/
├── app/
│   ├── globals.css         # Tailwind directives and custom utility styles
│   ├── layout.tsx          # Root layout & SEO metadata
│   └── page.tsx            # Main landing page assembling all sections
├── components/
│   ├── Logo.tsx            # FD Fast Delivery dynamic logo
│   ├── Navbar.tsx          # Top nav (Location, Search, Cart badge)
│   ├── CategoryBar.tsx     # Categories sub-bar & All Categories dropdown
│   ├── HeroSection.tsx     # "Daily Essentials, Delivered to Your Doorstep!"
│   ├── ShopByCategory.tsx  # 6 visual category cards with smooth hover
│   ├── PopularProducts.tsx # Sugar, Rice, Oil, Milk, Flour cards + Add to cart
│   ├── HowItWorks.tsx      # 3-step process + "Fast. Simple. Reliable."
│   ├── WhyChooseUs.tsx     # 4 features & "Your Everyday Needs..." promo card
│   ├── WhatsAppCTA.tsx     # "Order Now on WhatsApp" banner
│   ├── Footer.tsx          # Footer with Bilariyaganj care branding
│   ├── CartDrawer.tsx      # Slide-out cart drawer with live total & quantities
│   └── OrderModal.tsx      # Customer address form & WhatsApp order dispatcher
├── data/
│   └── mockData.ts         # Products, categories, location & site settings
├── tailwind.config.js      # Custom theme colors (brand yellow, red, dark)
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.mjs         # Next.js image domain configuration
└── package.json            # Project dependencies & scripts
```
