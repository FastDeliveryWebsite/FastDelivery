import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Manually parse .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  env.SUPABASE_Secret_key ||
  env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_Secret_key;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_Secret_key in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const CATEGORIES = [
  {
    name: "Grocery & Staples",
    slug: "grocery-staples",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
    display_order: 1,
  },
  {
    name: "Food & Drinks",
    slug: "food-drinks",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=500&q=80",
    display_order: 2,
  },
  {
    name: "Medicines",
    slug: "medicines",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    display_order: 3,
  },
  {
    name: "Vegetables",
    slug: "vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
    display_order: 4,
  },
  {
    name: "Dairy Products",
    slug: "dairy-products",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    display_order: 5,
  },
  {
    name: "Home & Cleaning",
    slug: "home-cleaning",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80",
    display_order: 6,
  },
];

const PRODUCTS = [
  {
    name: "Banana",
    categorySlug: "vegetables",
    categoryName: "Vegetables",
    weight: "1 Dozen",
    price: 60,
    originalPrice: 70,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Origin", value: "Bilariyaganj Mandi" },
      { label: "Type", value: "Fresh Yellow Banana" },
    ],
  },
  {
    name: "Basmati Rice",
    categorySlug: "grocery-staples",
    categoryName: "Grocery & Staples",
    weight: "1 Kg",
    price: 110,
    originalPrice: 125,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Grain Length", value: "Long Grain Premium" },
      { label: "Packaging", value: "Sealed Bag" },
    ],
  },
  {
    name: "Cooking Oil",
    categorySlug: "grocery-staples",
    categoryName: "Grocery & Staples",
    weight: "1 L",
    price: 145,
    originalPrice: 160,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Type", value: "Refined Cooking Oil" },
      { label: "Volume", value: "1 Litre Bottle" },
    ],
  },
  {
    name: "Fresh Milk",
    categorySlug: "dairy-products",
    categoryName: "Dairy Products",
    weight: "1 L",
    price: 60,
    originalPrice: 66,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Type", value: "Fresh Toned Milk" },
      { label: "Fat Content", value: "3.5% Standard" },
    ],
  },
  {
    name: "Wheat Flour (Chakki Atta)",
    categorySlug: "grocery-staples",
    categoryName: "Grocery & Staples",
    weight: "5 Kg",
    price: 240,
    originalPrice: 265,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Milling", value: "Traditional Stone Chakki" },
      { label: "Nutrition", value: "100% Whole Wheat" },
    ],
  },
  {
    name: "Khade Masale (Whole Spices)",
    categorySlug: "grocery-staples",
    categoryName: "Grocery & Staples",
    weight: "500 g",
    price: 55,
    originalPrice: 75,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Mix", value: "Cardamom, Clove, Cinnamon, Bay Leaf" },
      { label: "Aroma", value: "Natural Pure Spices" },
    ],
  },
  {
    name: "Pure Kacchi Ghani Mustard Oil",
    categorySlug: "grocery-staples",
    categoryName: "Grocery & Staples",
    weight: "1 L",
    price: 165,
    originalPrice: 185,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Extraction", value: "Cold Pressed Kacchi Ghani" },
      { label: "Origin", value: "Local Uttar Pradesh Mills" },
    ],
  },
  {
    name: "Premium Assam Tea",
    categorySlug: "food-drinks",
    categoryName: "Food & Drinks",
    weight: "500 g",
    price: 140,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Grade", value: "CTC Strong Kadak Chai" },
      { label: "Region", value: "Upper Assam Valley" },
    ],
  },
  {
    name: "Fresh Malai Paneer",
    categorySlug: "dairy-products",
    categoryName: "Dairy Products",
    weight: "200 g",
    price: 90,
    originalPrice: 105,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Texture", value: "Soft & Creamy" },
      { label: "Source", value: "Pure Buffalo Milk" },
    ],
  },
  {
    name: "Lemon Dishwash Gel",
    categorySlug: "home-cleaning",
    categoryName: "Home & Cleaning",
    weight: "750 ml",
    price: 120,
    originalPrice: 140,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Fragrance", value: "Fresh Lemon" },
      { label: "Benefit", value: "Fast Grease Removal" },
    ],
  },
  {
    name: "Fresh Potatoes (Aloo)",
    categorySlug: "vegetables",
    categoryName: "Vegetables",
    weight: "1 Kg",
    price: 28,
    originalPrice: 35,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Quality", value: "Grade A New Crop" },
      { label: "Origin", value: "Azamgarh District Farms" },
    ],
  },
  {
    name: "Fresh Red Onions (Pyaaz)",
    categorySlug: "vegetables",
    categoryName: "Vegetables",
    weight: "1 Kg",
    price: 38,
    originalPrice: 45,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Size", value: "Medium-Large Bulbs" },
      { label: "Shelf Life", value: "2 Weeks Dry Stored" },
    ],
  },
  {
    name: "Farm Fresh Tomatoes (Tamatar)",
    categorySlug: "vegetables",
    categoryName: "Vegetables",
    weight: "1 Kg",
    price: 32,
    originalPrice: 40,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Type", value: "Local Hybrid Red" },
      { label: "Harvest", value: "Daily Fresh Plucked" },
    ],
  },
  {
    name: "Ginger & Garlic Combo (Adrak-Lahsun)",
    categorySlug: "vegetables",
    categoryName: "Vegetables",
    weight: "250 g",
    price: 45,
    originalPrice: 55,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Combo", value: "125g Ginger + 125g Garlic" },
      { label: "Quality", value: "Clean & Rooted" },
    ],
  },
  {
    name: "Fresh Green Chillies (Hari Mirch)",
    categorySlug: "vegetables",
    categoryName: "Vegetables",
    weight: "250 g",
    price: 20,
    originalPrice: 25,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Heat", value: "Spicy Medium" },
      { label: "Freshness", value: "Bright Green Stalks" },
    ],
  },
  {
    name: "Fresh Plain Dahi (Curd)",
    categorySlug: "dairy-products",
    categoryName: "Dairy Products",
    weight: "500 g",
    price: 45,
    originalPrice: 50,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Type", value: "Thick Sweetish Dahi" },
      { label: "Container", value: "Hygienic Tub" },
    ],
  },
  {
    name: "Pasteurized Table Butter",
    categorySlug: "dairy-products",
    categoryName: "Dairy Products",
    weight: "100 g",
    price: 58,
    originalPrice: 62,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Taste", value: "Lightly Salted" },
      { label: "Storage", value: "Refrigerated" },
    ],
  },
  {
    name: "Pure Danedar Cow Desi Ghee",
    categorySlug: "dairy-products",
    categoryName: "Dairy Products",
    weight: "500 ml",
    price: 360,
    originalPrice: 395,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Method", value: "Traditional Bilona Ghee" },
      { label: "Aroma", value: "Rich Danedar" },
    ],
  },
  {
    name: "Masala Instant Noodles (Pack of 4)",
    categorySlug: "food-drinks",
    categoryName: "Food & Drinks",
    weight: "280 g",
    price: 56,
    originalPrice: 60,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Cooking Time", value: "2 Minutes" },
      { label: "Flavor", value: "Authentic Indian Masala" },
    ],
  },
  {
    name: "Crispy Glucose Biscuits (Pack of 3)",
    categorySlug: "food-drinks",
    categoryName: "Food & Drinks",
    weight: "300 g",
    price: 30,
    originalPrice: 35,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Pack", value: "3 Individual Rolls" },
      { label: "Pairing", value: "Best with Morning Tea" },
    ],
  },
  {
    name: "100% Mixed Fruit Juice",
    categorySlug: "food-drinks",
    categoryName: "Food & Drinks",
    weight: "1 L",
    price: 115,
    originalPrice: 130,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Fruits", value: "Apple, Orange, Guava, Mango" },
      { label: "Added Vitamins", value: "Rich in Vitamin C" },
    ],
  },
  {
    name: "Paracetamol 650 mg (Strip of 15)",
    categorySlug: "medicines",
    categoryName: "Medicines",
    weight: "15 Tablets",
    price: 32,
    originalPrice: 40,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Strength", value: "650 mg Fast Relief" },
      { label: "Use", value: "Fever & Pain Relief" },
    ],
  },
  {
    name: "WHO Formula ORS Electrolyte Drink",
    categorySlug: "medicines",
    categoryName: "Medicines",
    weight: "Pack of 3",
    price: 60,
    originalPrice: 66,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Standard", value: "WHO Certified Formula" },
      { label: "Benefits", value: "Instant Rehydration" },
    ],
  },
  {
    name: "First Aid Antiseptic Liquid",
    categorySlug: "medicines",
    categoryName: "Medicines",
    weight: "100 ml",
    price: 75,
    originalPrice: 85,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Action", value: "Cuts, Scrapes & Hygiene" },
      { label: "Size", value: "100 ml Travel Bottle" },
    ],
  },
  {
    name: "Advanced Bright Detergent Powder",
    categorySlug: "home-cleaning",
    categoryName: "Home & Cleaning",
    weight: "1 Kg",
    price: 95,
    originalPrice: 110,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Power", value: "Oxy-Enzymes for Stains" },
      { label: "Color Care", value: "Safe for White & Colors" },
    ],
  },
  {
    name: "Citrus Floor Cleaner & Disinfectant",
    categorySlug: "home-cleaning",
    categoryName: "Home & Cleaning",
    weight: "500 ml",
    price: 85,
    originalPrice: 100,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80",
    specifications: [
      { label: "Germ Kill", value: "99.9% Protection" },
      { label: "Fragrance", value: "Long Lasting Citrus Pine" },
    ],
  },
  {
    name: "Neem & Tulsi Bath Soap (Pack of 4)",
    categorySlug: "home-cleaning",
    categoryName: "Home & Cleaning",
    weight: "4 x 100 g",
    price: 110,
    originalPrice: 130,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80",
    specifications: [
      { label: "Extracts", value: "Pure Neem & Tulsi Oil" },
      { label: "Skin Type", value: "Antibacterial Protection" },
    ],
  },
];

async function seed() {
  console.log("🌱 Starting Database Seed for Fast Delivery Bilariyaganj...\n");

  // 1. Upsert Categories
  console.log("📁 Seeding Categories...");
  const categoryMap = {};

  for (const cat of CATEGORIES) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(
        {
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          display_order: cat.display_order,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) {
      console.error(`❌ Failed to seed category "${cat.name}":`, error.message);
    } else {
      categoryMap[cat.slug] = data.id;
      console.log(`   ✓ ${cat.name} (ID: ${data.id})`);
    }
  }

  // 2. Clear old products & insert new products
  console.log("\n📦 Seeding Products...");
  await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  let successCount = 0;
  for (const prod of PRODUCTS) {
    const catId = categoryMap[prod.categorySlug] || null;

    const { error } = await supabase.from("products").insert([
      {
        name: prod.name,
        category_id: catId,
        category_name: prod.categoryName,
        weight: prod.weight,
        price: prod.price,
        original_price: prod.originalPrice,
        image: prod.image,
        specifications: prod.specifications,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to insert "${prod.name}":`, error.message);
    } else {
      successCount++;
      console.log(`   ✓ [${prod.categoryName}] ${prod.name} - ₹${prod.price}`);
    }
  }

  console.log(`\n🎉 Seed Completed Successfully!`);
  console.log(`   - Categories: ${CATEGORIES.length}`);
  console.log(`   - Products:   ${successCount} of ${PRODUCTS.length} seeded\n`);
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
