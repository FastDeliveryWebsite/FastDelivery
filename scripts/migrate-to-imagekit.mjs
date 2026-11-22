import ImageKit from "imagekit";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Load .env
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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_Secret_key || env.SUPABASE_SERVICE_ROLE_KEY;

const imagekit = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "_")
    .substring(0, 40);
}

async function uploadToImageKit(imageUrl, fileName, folder) {
  try {
    const result = await imagekit.upload({
      file: imageUrl, // ImageKit supports direct URL fetching!
      fileName: `${fileName}_${Date.now()}.jpg`,
      folder: `/fast-delivery/${folder}`,
      useUniqueFileName: true,
    });
    return result.url;
  } catch (err) {
    console.error(`   ⚠️ ImageKit upload failed for ${fileName}:`, err.message);
    return null;
  }
}

async function migrate() {
  console.log("🚀 Migrating All Images to ImageKit (ik.imagekit.io/kq0urhqlu)...\n");

  // 1. Migrate Categories
  console.log("📁 Processing Categories...");
  const { data: categories, error: catErr } = await supabase.from("categories").select("*");
  if (catErr) {
    console.error("Failed to fetch categories:", catErr);
    return;
  }

  for (const cat of categories) {
    if (cat.image && !cat.image.includes("ik.imagekit.io")) {
      process.stdout.write(`   Uploading [Category] ${cat.name}... `);
      const ikUrl = await uploadToImageKit(cat.image, sanitizeFileName(cat.slug), "categories");
      if (ikUrl) {
        await supabase.from("categories").update({ image: ikUrl }).eq("id", cat.id);
        console.log(`✓ -> ${ikUrl}`);
      }
    } else {
      console.log(`   ✓ [Category] ${cat.name} already hosted on ImageKit`);
    }
  }

  // 2. Migrate Products
  console.log("\n📦 Processing Products...");
  const { data: products, error: prodErr } = await supabase.from("products").select("*");
  if (prodErr) {
    console.error("Failed to fetch products:", prodErr);
    return;
  }

  let count = 0;
  for (const prod of products) {
    if (prod.image && !prod.image.includes("ik.imagekit.io")) {
      process.stdout.write(`   Uploading (${++count}/${products.length}) ${prod.name}... `);
      const ikUrl = await uploadToImageKit(prod.image, sanitizeFileName(prod.name), "products");
      if (ikUrl) {
        await supabase.from("products").update({ image: ikUrl }).eq("id", prod.id);
        console.log(`✓`);
      }
    } else {
      console.log(`   ✓ (${++count}/${products.length}) ${prod.name} already hosted on ImageKit`);
    }
  }

  console.log("\n✨ ImageKit Migration Completed! All images are now hosted on ImageKit CDN and referenced in Supabase.");
}

migrate().catch(console.error);
