export interface Product {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  description?: string;
  specifications?: Record<string, string>;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount?: string;
}

export const SITE_CONFIG = {
  name: "Fast Delivery",
  location: "Bilariyaganj",
  region: "Uttar Pradesh",
  adminPhone: "",
  whatsappNumber: "",
  tagline: "Daily Essentials, Delivered to Your Doorstep!",
  subTagline: "Groceries, Food, Medicines and Household Needs — all in one place!",
  badgeText: "Bilariyaganj me Fast Delivery!",
};

export const CATEGORIES: Category[] = [
  {
    id: "grocery-staples",
    name: "Grocery & Staples",
    slug: "grocery-staples",
    iconName: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
    itemCount: "40+ Items",
  },
  {
    id: "food-drinks",
    name: "Food & Drinks",
    slug: "food-drinks",
    iconName: "Utensils",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=500&q=80",
    itemCount: "60+ Items",
  },
  {
    id: "medicines",
    name: "Medicines",
    slug: "medicines",
    iconName: "Cross",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    itemCount: "100+ Essentials",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    slug: "vegetables",
    iconName: "Carrot",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
    itemCount: "Farm Fresh Daily",
  },
  {
    id: "dairy-products",
    name: "Dairy Products",
    slug: "dairy-products",
    iconName: "Milk",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    itemCount: "Pure & Fresh",
  },
  {
    id: "home-cleaning",
    name: "Home & Cleaning",
    slug: "home-cleaning",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80",
    itemCount: "30+ Essentials",
  },
];

export const POPULAR_PRODUCTS: Product[] = [
  {
    id: "banana",
    name: "Banana",
    weight: "1 Dozen",
    price: 60,
    originalPrice: 70,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: "basmati-rice-1kg",
    name: "Basmati Rice",
    weight: "1 Kg",
    price: 110,
    originalPrice: 125,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
    category: "Grocery & Staples",
    inStock: true,
  },
  {
    id: "cooking-oil-1l",
    name: "Cooking Oil",
    weight: "1 L",
    price: 145,
    originalPrice: 160,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
    category: "Grocery & Staples",
    inStock: true,
  },
  {
    id: "milk-pouch-1l",
    name: "Fresh Milk",
    weight: "1 L",
    price: 60,
    originalPrice: 66,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    category: "Dairy Products",
    inStock: true,
  },
  {
    id: "wheat-flour-5kg",
    name: "Wheat Flour (Chakki Atta)",
    weight: "5 Kg",
    price: 240,
    originalPrice: 265,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    category: "Grocery & Staples",
    inStock: true,
  },
];

export const RECENTLY_ADDED_PRODUCTS: Product[] = [
  {
    id: "khade-masale",
    name: "Khade Masale (Whole Spices)",
    weight: "500 g",
    price: 55,
    originalPrice: 75,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    category: "Grocery & Staples",
    inStock: true,
  },
  {
    id: "mustard-oil-1l",
    name: "Pure Kacchi Ghani Mustard Oil",
    weight: "1 L",
    price: 165,
    originalPrice: 185,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    category: "Grocery & Staples",
    inStock: true,
  },
  {
    id: "premium-tea-500g",
    name: "Premium Assam Tea",
    weight: "500 g",
    price: 140,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    category: "Food & Drinks",
    inStock: true,
  },
  {
    id: "fresh-paneer-200g",
    name: "Fresh Malai Paneer",
    weight: "200 g",
    price: 90,
    originalPrice: 105,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    category: "Dairy Products",
    inStock: true,
  },
  {
    id: "dishwash-gel-750ml",
    name: "Lemon Dishwash Gel",
    weight: "750 ml",
    price: 120,
    originalPrice: 140,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    category: "Home & Cleaning",
    inStock: true,
  },
];

// Additional products to support realistic category pages with filters and pagination
export const MORE_PRODUCTS: Product[] = [
  // Vegetables
  {
    id: "fresh-potato-1kg",
    name: "Fresh Potatoes (Aloo)",
    weight: "1 Kg",
    price: 28,
    originalPrice: 35,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: "fresh-onion-1kg",
    name: "Fresh Red Onions (Pyaaz)",
    weight: "1 Kg",
    price: 38,
    originalPrice: 45,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: "fresh-tomato-1kg",
    name: "Farm Fresh Tomatoes (Tamatar)",
    weight: "1 Kg",
    price: 32,
    originalPrice: 40,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: "fresh-ginger-garlic",
    name: "Ginger & Garlic Combo (Adrak-Lahsun)",
    weight: "250 g",
    price: 45,
    originalPrice: 55,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: "green-chilli-250g",
    name: "Fresh Green Chillies (Hari Mirch)",
    weight: "250 g",
    price: 20,
    originalPrice: 25,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    inStock: true,
  },

  // Dairy Products
  {
    id: "fresh-curd-500g",
    name: "Fresh Plain Dahi (Curd)",
    weight: "500 g",
    price: 45,
    originalPrice: 50,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
    category: "Dairy Products",
    inStock: true,
  },
  {
    id: "butter-100g",
    name: "Pasteurized Table Butter",
    weight: "100 g",
    price: 58,
    originalPrice: 62,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
    category: "Dairy Products",
    inStock: true,
  },
  {
    id: "pure-desi-ghee-500ml",
    name: "Pure Danedar Cow Desi Ghee",
    weight: "500 ml",
    price: 360,
    originalPrice: 395,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
    category: "Dairy Products",
    inStock: true,
  },

  // Food & Drinks
  {
    id: "instant-noodles-pack",
    name: "Masala Instant Noodles (Pack of 4)",
    weight: "280 g",
    price: 56,
    originalPrice: 60,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80",
    category: "Food & Drinks",
    inStock: true,
  },
  {
    id: "glucose-biscuits-pack",
    name: "Crispy Glucose Biscuits (Pack of 3)",
    weight: "300 g",
    price: 30,
    originalPrice: 35,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80",
    category: "Food & Drinks",
    inStock: true,
  },
  {
    id: "mixed-fruit-juice-1l",
    name: "100% Mixed Fruit Juice",
    weight: "1 L",
    price: 115,
    originalPrice: 130,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80",
    category: "Food & Drinks",
    inStock: true,
  },

  // Medicines
  {
    id: "paracetamol-strip",
    name: "Paracetamol 650 mg (Strip of 15)",
    weight: "15 Tablets",
    price: 32,
    originalPrice: 40,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    category: "Medicines",
    inStock: true,
  },
  {
    id: "ors-sachet-pack",
    name: "WHO Formula ORS Electrolyte Drink",
    weight: "Pack of 3",
    price: 60,
    originalPrice: 66,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80",
    category: "Medicines",
    inStock: true,
  },
  {
    id: "antiseptic-liquid-100ml",
    name: "First Aid Antiseptic Liquid",
    weight: "100 ml",
    price: 75,
    originalPrice: 85,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=500&q=80",
    category: "Medicines",
    inStock: true,
  },

  // Home & Cleaning
  {
    id: "detergent-powder-1kg",
    name: "Advanced Bright Detergent Powder",
    weight: "1 Kg",
    price: 95,
    originalPrice: 110,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80",
    category: "Home & Cleaning",
    inStock: true,
  },
  {
    id: "surface-disinfectant-500ml",
    name: "Citrus Floor Cleaner & Disinfectant",
    weight: "500 ml",
    price: 85,
    originalPrice: 100,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80",
    category: "Home & Cleaning",
    inStock: true,
  },
  {
    id: "bath-soap-combo-pack",
    name: "Neem & Tulsi Bath Soap (Pack of 4)",
    weight: "4 x 100 g",
    price: 110,
    originalPrice: 130,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80",
    category: "Home & Cleaning",
    inStock: true,
  },
];

export const ALL_PRODUCTS: Product[] = [
  ...POPULAR_PRODUCTS,
  ...RECENTLY_ADDED_PRODUCTS,
  ...MORE_PRODUCTS,
];

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose Products",
    description: "Browse and add items to cart",
    icon: "ShoppingCart",
  },
  {
    step: 2,
    title: "Place Your Order",
    description: "Enter details and confirm order",
    icon: "ClipboardList",
  },
  {
    step: 3,
    title: "Doorstep Delivery",
    description: "Delivered in 15-30 minutes across Bilariyaganj",
    icon: "Truck",
  },
];

export const WHY_CHOOSE_US = [
  {
    id: "fast-delivery",
    title: "15-30 Min Delivery",
    subtitle: "Fastest delivery to your home in Bilariyaganj",
    icon: "Zap",
  },
  {
    id: "best-quality",
    title: "100% Fresh & Genuine",
    subtitle: "Direct from verified local shops and mandis",
    icon: "ShieldCheck",
  },
  {
    id: "best-prices",
    title: "Bilariyaganj Rates",
    subtitle: "Same local market price with no extra charges",
    icon: "Tag",
  },
  {
    id: "easy-ordering",
    title: "Direct WhatsApp Call",
    subtitle: "Call or message our local hub anytime",
    icon: "Headphones",
  },
];

export const TESTIMONIALS = [
  {
    id: "1",
    name: "Mohammad Tariq",
    location: "Kasba Ward 4, Bilariyaganj",
    comment: "Subah milk aur bread order kiya tha, 20 minute me delivery boy gate pe tha! Bahut badhiya service.",
    rating: 5,
    avatarColor: "bg-emerald-600",
  },
  {
    id: "2",
    name: "Sunita Devi",
    location: "Purana Bazar, Bilariyaganj",
    comment: "Sabziyaan bilkul taazi rehti hain aur mandi ke daam pe mil jati hain bina dhoop me nikle.",
    rating: 5,
    avatarColor: "bg-amber-600",
  },
  {
    id: "3",
    name: "Amit Gupta",
    location: "Station Road, Bilariyaganj",
    comment: "Cash on delivery aur UPI dono chalta hai. Bilariyaganj ke liye ye service sach me bohot useful hai.",
    rating: 5,
    avatarColor: "bg-blue-600",
  },
  {
    id: "4",
    name: "Zafar Ahmad",
    location: "Chowk Bazar, Bilariyaganj",
    comment: "Bas WhatsApp pe list bhejo aur aadhe ghante me samaan ghar par. Highly recommended for families.",
    rating: 5,
    avatarColor: "bg-purple-600",
  },
];
