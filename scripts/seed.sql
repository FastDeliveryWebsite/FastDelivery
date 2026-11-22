-- ==============================================================================
-- FAST DELIVERY BILARIYAGANJ - SUPABASE SEED SCRIPT
-- Seeds all mock Categories and Products into Supabase Database
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Ensure Categories Table Exists
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ensure Products Table Exists
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT NOT NULL,
  specifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Grant Permissions & Disable RLS for Full API Access
GRANT ALL ON TABLE public.categories TO service_role, anon, authenticated;
GRANT ALL ON TABLE public.products TO service_role, anon, authenticated;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 4. Insert or Update All Store Categories
INSERT INTO public.categories (name, slug, image, display_order)
VALUES
  ('Grocery & Staples', 'grocery-staples', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', 1),
  ('Food & Drinks', 'food-drinks', 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=500&q=80', 2),
  ('Medicines', 'medicines', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80', 3),
  ('Vegetables', 'vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80', 4),
  ('Dairy Products', 'dairy-products', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80', 5),
  ('Home & Cleaning', 'home-cleaning', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80', 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 5. Clear existing products (optional, ensures fresh mock catalog with no duplicates)
DELETE FROM public.products;

-- 6. Insert All 27 Mock Products
INSERT INTO public.products (name, category_id, category_name, weight, price, original_price, image, specifications)
VALUES
  -- 1. Banana
  (
    'Banana',
    (SELECT id FROM public.categories WHERE slug = 'vegetables' LIMIT 1),
    'Vegetables',
    '1 Dozen',
    60,
    70,
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Origin", "value": "Bilariyaganj Mandi"}, {"label": "Type", "value": "Fresh Yellow Banana"}]'::jsonb
  ),

  -- 2. Basmati Rice
  (
    'Basmati Rice',
    (SELECT id FROM public.categories WHERE slug = 'grocery-staples' LIMIT 1),
    'Grocery & Staples',
    '1 Kg',
    110,
    125,
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Grain Length", "value": "Long Grain Premium"}, {"label": "Packaging", "value": "Sealed Bag"}]'::jsonb
  ),

  -- 3. Cooking Oil
  (
    'Cooking Oil',
    (SELECT id FROM public.categories WHERE slug = 'grocery-staples' LIMIT 1),
    'Grocery & Staples',
    '1 L',
    145,
    160,
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Type", "value": "Refined Cooking Oil"}, {"label": "Volume", "value": "1 Litre Bottle"}]'::jsonb
  ),

  -- 4. Fresh Milk
  (
    'Fresh Milk',
    (SELECT id FROM public.categories WHERE slug = 'dairy-products' LIMIT 1),
    'Dairy Products',
    '1 L',
    60,
    66,
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Type", "value": "Fresh Toned Milk"}, {"label": "Fat Content", "value": "3.5% Standard"}]'::jsonb
  ),

  -- 5. Wheat Flour (Chakki Atta)
  (
    'Wheat Flour (Chakki Atta)',
    (SELECT id FROM public.categories WHERE slug = 'grocery-staples' LIMIT 1),
    'Grocery & Staples',
    '5 Kg',
    240,
    265,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Milling", "value": "Traditional Stone Chakki"}, {"label": "Nutrition", "value": "100% Whole Wheat"}]'::jsonb
  ),

  -- 6. Khade Masale (Whole Spices)
  (
    'Khade Masale (Whole Spices)',
    (SELECT id FROM public.categories WHERE slug = 'grocery-staples' LIMIT 1),
    'Grocery & Staples',
    '500 g',
    55,
    75,
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Mix", "value": "Cardamom, Clove, Cinnamon, Bay Leaf"}, {"label": "Aroma", "value": "Natural Pure Spices"}]'::jsonb
  ),

  -- 7. Pure Kacchi Ghani Mustard Oil
  (
    'Pure Kacchi Ghani Mustard Oil',
    (SELECT id FROM public.categories WHERE slug = 'grocery-staples' LIMIT 1),
    'Grocery & Staples',
    '1 L',
    165,
    185,
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Extraction", "value": "Cold Pressed Kacchi Ghani"}, {"label": "Origin", "value": "Local Uttar Pradesh Mills"}]'::jsonb
  ),

  -- 8. Premium Assam Tea
  (
    'Premium Assam Tea',
    (SELECT id FROM public.categories WHERE slug = 'food-drinks' LIMIT 1),
    'Food & Drinks',
    '500 g',
    140,
    180,
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Grade", "value": "CTC Strong Kadak Chai"}, {"label": "Region", "value": "Upper Assam Valley"}]'::jsonb
  ),

  -- 9. Fresh Malai Paneer
  (
    'Fresh Malai Paneer',
    (SELECT id FROM public.categories WHERE slug = 'dairy-products' LIMIT 1),
    'Dairy Products',
    '200 g',
    90,
    105,
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Texture", "value": "Soft & Creamy"}, {"label": "Source", "value": "Pure Buffalo Milk"}]'::jsonb
  ),

  -- 10. Lemon Dishwash Gel
  (
    'Lemon Dishwash Gel',
    (SELECT id FROM public.categories WHERE slug = 'home-cleaning' LIMIT 1),
    'Home & Cleaning',
    '750 ml',
    120,
    140,
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Fragrance", "value": "Fresh Lemon"}, {"label": "Benefit", "value": "Grease Removal"}]'::jsonb
  ),

  -- 11. Fresh Potatoes (Aloo)
  (
    'Fresh Potatoes (Aloo)',
    (SELECT id FROM public.categories WHERE slug = 'vegetables' LIMIT 1),
    'Vegetables',
    '1 Kg',
    28,
    35,
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Quality", "value": "Grade A New Crop"}, {"label": "Origin", "value": "Azamgarh District Farms"}]'::jsonb
  ),

  -- 12. Fresh Red Onions (Pyaaz)
  (
    'Fresh Red Onions (Pyaaz)',
    (SELECT id FROM public.categories WHERE slug = 'vegetables' LIMIT 1),
    'Vegetables',
    '1 Kg',
    38,
    45,
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Size", "value": "Medium-Large Bulbs"}, {"label": "Shelf Life", "value": "2 Weeks Dry Stored"}]'::jsonb
  ),

  -- 13. Farm Fresh Tomatoes (Tamatar)
  (
    'Farm Fresh Tomatoes (Tamatar)',
    (SELECT id FROM public.categories WHERE slug = 'vegetables' LIMIT 1),
    'Vegetables',
    '1 Kg',
    32,
    40,
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Type", "value": "Local Hybrid Red"}, {"label": "Harvest", "value": "Daily Fresh Plucked"}]'::jsonb
  ),

  -- 14. Ginger & Garlic Combo (Adrak-Lahsun)
  (
    'Ginger & Garlic Combo (Adrak-Lahsun)',
    (SELECT id FROM public.categories WHERE slug = 'vegetables' LIMIT 1),
    'Vegetables',
    '250 g',
    45,
    55,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Combo", "value": "125g Ginger + 125g Garlic"}, {"label": "Quality", "value": "Clean & Rooted"}]'::jsonb
  ),

  -- 15. Fresh Green Chillies (Hari Mirch)
  (
    'Fresh Green Chillies (Hari Mirch)',
    (SELECT id FROM public.categories WHERE slug = 'vegetables' LIMIT 1),
    'Vegetables',
    '250 g',
    20,
    25,
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Heat", "value": "Spicy Medium"}, {"label": "Freshness", "value": "Bright Green Stalks"}]'::jsonb
  ),

  -- 16. Fresh Plain Dahi (Curd)
  (
    'Fresh Plain Dahi (Curd)',
    (SELECT id FROM public.categories WHERE slug = 'dairy-products' LIMIT 1),
    'Dairy Products',
    '500 g',
    45,
    50,
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Type", "value": "Thick Sweetish Dahi"}, {"label": "Container", "value": "Hygienic Tub"}]'::jsonb
  ),

  -- 17. Pasteurized Table Butter
  (
    'Pasteurized Table Butter',
    (SELECT id FROM public.categories WHERE slug = 'dairy-products' LIMIT 1),
    'Dairy Products',
    '100 g',
    58,
    62,
    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Taste", "value": "Lightly Salted"}, {"label": "Storage", "value": "Refrigerated"}]'::jsonb
  ),

  -- 18. Pure Danedar Cow Desi Ghee
  (
    'Pure Danedar Cow Desi Ghee',
    (SELECT id FROM public.categories WHERE slug = 'dairy-products' LIMIT 1),
    'Dairy Products',
    '500 ml',
    360,
    395,
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Method", "value": "Traditional Bilona Ghee"}, {"label": "Aroma", "value": "Rich Danedar"}]'::jsonb
  ),

  -- 19. Masala Instant Noodles (Pack of 4)
  (
    'Masala Instant Noodles (Pack of 4)',
    (SELECT id FROM public.categories WHERE slug = 'food-drinks' LIMIT 1),
    'Food & Drinks',
    '280 g',
    56,
    60,
    'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Cooking Time", "value": "2 Minutes"}, {"label": "Flavor", "value": "Authentic Indian Masala"}]'::jsonb
  ),

  -- 20. Crispy Glucose Biscuits (Pack of 3)
  (
    'Crispy Glucose Biscuits (Pack of 3)',
    (SELECT id FROM public.categories WHERE slug = 'food-drinks' LIMIT 1),
    'Food & Drinks',
    '300 g',
    30,
    35,
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Pack", "value": "3 Individual Rolls"}, {"label": "Pairing", "value": "Best with Morning Tea"}]'::jsonb
  ),

  -- 21. 100% Mixed Fruit Juice
  (
    '100% Mixed Fruit Juice',
    (SELECT id FROM public.categories WHERE slug = 'food-drinks' LIMIT 1),
    'Food & Drinks',
    '1 L',
    115,
    130,
    'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Fruits", "value": "Apple, Orange, Guava, Mango"}, {"label": "No Preservatives", "value": "Added Vitamin C"}]'::jsonb
  ),

  -- 22. Paracetamol 650 mg (Strip of 15)
  (
    'Paracetamol 650 mg (Strip of 15)',
    (SELECT id FROM public.categories WHERE slug = 'medicines' LIMIT 1),
    'Medicines',
    '15 Tablets',
    32,
    40,
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Strength", "value": "650 mg Fast Relief"}, {"label": "Use", "value": "Fever & Pain Relief"}]'::jsonb
  ),

  -- 23. WHO Formula ORS Electrolyte Drink
  (
    'WHO Formula ORS Electrolyte Drink',
    (SELECT id FROM public.categories WHERE slug = 'medicines' LIMIT 1),
    'Medicines',
    'Pack of 3',
    60,
    66,
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Standard", "value": "WHO Certified Formula"}, {"label": "Benefits", "value": "Instant Rehydration"}]'::jsonb
  ),

  -- 24. First Aid Antiseptic Liquid
  (
    'First Aid Antiseptic Liquid',
    (SELECT id FROM public.categories WHERE slug = 'medicines' LIMIT 1),
    'Medicines',
    '100 ml',
    75,
    85,
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Action", "value": "Cuts, Scrapes & Hygiene"}, {"label": "Size", "value": "100 ml Travel Bottle"}]'::jsonb
  ),

  -- 25. Advanced Bright Detergent Powder
  (
    'Advanced Bright Detergent Powder',
    (SELECT id FROM public.categories WHERE slug = 'home-cleaning' LIMIT 1),
    'Home & Cleaning',
    '1 Kg',
    95,
    110,
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Power", "value": "Oxy-Enzymes for Stains"}, {"label": "Color Care", "value": "Safe for White & Colors"}]'::jsonb
  ),

  -- 26. Citrus Floor Cleaner & Disinfectant
  (
    'Citrus Floor Cleaner & Disinfectant',
    (SELECT id FROM public.categories WHERE slug = 'home-cleaning' LIMIT 1),
    'Home & Cleaning',
    '500 ml',
    85,
    100,
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80',
    '[{"label": "Germ Kill", "value": "99.9% Protection"}, {"label": "Fragrance", "value": "Long Lasting Citrus Pine"}]'::jsonb
  ),

  -- 27. Neem & Tulsi Bath Soap (Pack of 4)
  (
    'Neem & Tulsi Bath Soap (Pack of 4)',
    (SELECT id FROM public.categories WHERE slug = 'home-cleaning' LIMIT 1),
    'Home & Cleaning',
    '4 x 100 g',
    110,
    130,
    'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80',
    '[{"label": "Extracts", "value": "Pure Neem & Tulsi Oil"}, {"label": "Skin Type", "value": "Antibacterial Protection"}]'::jsonb
  );
