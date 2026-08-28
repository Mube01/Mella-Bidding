import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

const connection = await mongoose.connect(process.env.MONGODB_URI);
const users = connection.connection.collection("users");
const auctions = connection.connection.collection("auctions");
const bids = connection.connection.collection("bids");

const winner = await users.findOneAndUpdate(
  { phone: "0900000000" },
  {
    $set: { name: "Sample Winner", email: "sample-winner@mella.et", role: "user", updatedAt: new Date() },
    $setOnInsert: {
      phone: "0900000000",
      password: await bcrypt.hash(`sample-${Date.now()}`, 12),
      createdAt: new Date(),
    },
  },
  { upsert: true, returnDocument: "after" }
);

const auction = await auctions.findOneAndUpdate(
  { publicId: "M-DEMO-001" },
  {
    $set: {
      title: { en: "Sample Lowest Unique Bid Auction", am: "የዝቅተኛ ልዩ መጫረቻ ምሳሌ ጨረታ" },
      subtitle: { en: "Transparent result demonstration", am: "ግልጽ የውጤት ማሳያ" },
      description: { en: "A completed sample auction used to demonstrate the lowest unique bid rule.", am: "የዝቅተኛ ልዩ መጫረቻ ደንብን ለማሳየት የተጠናቀቀ ምሳሌ ጨረታ።" },
      category: "Electronics",
      image: "/images/iphone.avif",
      entryCost: 1,
      startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      featured: false,
      participantCount: 4,
      bidCount: 4,
      updatedAt: new Date(),
    },
    $setOnInsert: { publicId: "M-DEMO-001", createdAt: new Date() },
  },
  { upsert: true, returnDocument: "after" }
);

const auctionId = auction._id;
await bids.deleteMany({ auctionId });
const createdAt = new Date(Date.now() - 25 * 60 * 1000);
const sampleBids = [1, 2, 2, 3].map((amount, index) => ({
  auctionId,
  userId: index === 0 ? winner._id : new mongoose.Types.ObjectId(),
  amount,
  status: "accepted",
  createdAt: new Date(createdAt.getTime() + index * 60 * 1000),
}));
await bids.insertMany(sampleBids);

await auctions.updateOne(
  { _id: auctionId },
  { $set: { winnerUserId: winner._id, winningBidId: sampleBids[0]._id, completedAt: new Date() } }
);

console.log("Seeded sample result M-DEMO-001: Sample Winner won with the lowest unique bid of 1 ETB");
await mongoose.disconnect();
