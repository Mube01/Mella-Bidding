import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "node:fs";

function loadLocalEnvironment() {
  if (!fs.existsSync(".env.local")) return;

  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

loadLocalEnvironment();

const required = [
  "MONGODB_URI",
  "ADMIN_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PHONE",
  "ADMIN_PASSWORD",
];

for (const name of required) {
  if (!process.env[name]?.trim()) {
    throw new Error(`${name} is required`);
  }
}

const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
const phone = process.env.ADMIN_PHONE.replace(/\s+/g, "").trim();
const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

const connection = await mongoose.connect(process.env.MONGODB_URI);
const users = connection.connection.collection("users");
const existing = await users.findOne({
  $or: [{ email }, { phone }],
});

if (existing) {
  await users.updateOne(
    { _id: existing._id },
    {
      $set: {
        name: process.env.ADMIN_NAME.trim(),
        email,
        phone,
        password,
        role: "admin",
        updatedAt: new Date(),
      },
    }
  );
  console.log(`Updated admin account: ${email}`);
} else {
  await users.insertOne({
    name: process.env.ADMIN_NAME.trim(),
    email,
    phone,
    password,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`Created admin account: ${email}`);
}

await mongoose.disconnect();