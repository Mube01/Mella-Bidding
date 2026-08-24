import type { Config } from "tailwindcss";
const config: Config = { content:["./app/**/*.{js,ts,jsx,tsx,mdx}"], theme:{extend:{colors:{mella:{ink:"#11110F",cream:"#FFFFFF",green:"#1681C5",light:"#F0FDF4"}},fontFamily:{display:["Georgia","serif"],sans:["Arial","sans-serif"]},boxShadow:{glow:"0 20px 80px rgba(21,128,61,.16)"}}},plugins:[] };
export default config;