import mongoose from "mongoose";
import fs from "node:fs";

function loadLocalEnvironment() {
  if (!fs.existsSync(".env.local")) return;
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

loadLocalEnvironment();
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");

const catalog = [
  ["M001", "iPhone 17 Pro Max", "256GB • Brand New", "Electronics", "/images/iphone.avif", 25],
  ["M007", "Mystery Tech Box", "Something exciting is waiting inside", "Mystery Box", "/images/iphone.avif", 15],
  ["M003", "BYD Seagull", "Electric • Brand New", "Automotive", "/images/byd2.avif", 100],
  ["M004", "LG Smart Refrigerator", "450L • Inverter", "Home", "/images/refrigerator.avif", 25],
  ["M002", "Samsung 65 OLED TV", "4K Smart TV • 2026", "Electronics", "/images/refrigerator.avif", 25],
  ["M005", "MacBook Air", "M4 • 16GB RAM • 256GB", "Electronics", "/images/iphone.avif", 25],
  ["M006", "PlayStation 5", "Slim Edition • 1TB", "Electronics", "/images/iphone.avif", 25],
];

const now = Date.now();
const description = "Join this Mella auction and submit your lowest unique bid before the countdown ends.";
const auctions = catalog.map(([publicId, title, subtitle, category, image, entryCost], index) => ({
  publicId, title: { en: title, am: title }, subtitle: { en: subtitle, am: subtitle }, description: { en: description, am: description }, category, image, entryCost,
  startsAt: new Date(now - 60 * 60 * 1000),
  endsAt: new Date(now + (index + 1) * 24 * 60 * 60 * 1000),
  status: "live", participantCount: 0, bidCount: 0,
}));

const connection = await mongoose.connect(process.env.MONGODB_URI);
const collection = connection.connection.collection("auctions");
for (const auction of auctions) {
  await collection.updateOne({ publicId: auction.publicId }, { $set: auction, $setOnInsert: { createdAt: new Date() }, $currentDate: { updatedAt: true } }, { upsert: true });
}
console.log(`Seeded ${auctions.length} auctions`);
await mongoose.disconnect();