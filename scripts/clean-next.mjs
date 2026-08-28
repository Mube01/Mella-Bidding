import fs from "node:fs";

fs.rmSync(".next", { recursive: true, force: true });
console.log("Removed .next build cache. Start development with: npm run dev");