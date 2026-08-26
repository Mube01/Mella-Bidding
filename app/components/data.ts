export type Auction = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  time: string;
  participants: number;
  entry: string;
};

export const auctions: Auction[] = [
  {
    id: "M001",
    title: "iPhone 17 Pro Max",
    subtitle: "256GB • Brand New",
    description:
      "Get your hands on the latest iPhone 17 Pro Max, featuring 256GB of storage, a powerful next-generation processor, an advanced camera system, and a premium titanium design. This auction item is brand new and comes with its original packaging.",
    category: "Electronics",
    image: "/images/iphone.avif",
    time: "02:14:36",
    participants: 842,
    entry: "25 ETB",
  },

  {
    id: "M007",
    title: "Mystery Tech Box",
    subtitle: "Something exciting is waiting inside",
    description:
      "A mystery box packed with exciting technology products. The exact contents remain a secret until the box is revealed. Every box contains carefully selected items with a combined value designed to make the experience exciting and rewarding.",
    category: "Mystery Box",
    image: "/images/box.jpg",
    time: "03:47:22",
    participants: 936,
    entry: "15 ETB",
  },

  {
    id: "M003",
    title: "BYD Seagull",
    subtitle: "Electric • Brand New",
    description:
      "The BYD Seagull is a compact fully electric vehicle designed for efficient and practical urban driving. This brand-new vehicle combines modern styling, electric performance, smart technology, and an efficient battery system in a compact package.",
    category: "Automotive",
    image: "/images/byd2.avif",
    time: "2d 08:24:12",
    participants: 1248,
    entry: "100 ETB",
  },

  {
    id: "M004",
    title: "LG Smart Refrigerator",
    subtitle: "450L • Inverter",
    description:
      "A spacious 450-liter LG smart refrigerator designed for modern homes. It features inverter technology for efficient operation, generous storage space, and smart cooling technology to help keep your food fresh for longer.",
    category: "Home",
    image: "/images/refrigerator.avif",
    time: "08:35:44",
    participants: 384,
    entry: "25 ETB",
  },

  {
    id: "M002",
    title: "Samsung 65″ OLED TV",
    subtitle: "4K Smart TV • 2026",
    description:
      "Experience movies, sports, and entertainment on a stunning 65-inch Samsung OLED display. With 4K resolution, deep contrast, vibrant colors, and smart TV functionality, this television is designed to deliver a premium home entertainment experience.",
    category: "Electronics",
    image: "/images/tv.jpg",
    time: "05:42:18",
    participants: 516,
    entry: "25 ETB",
  },

  {
    id: "M005",
    title: "MacBook Air",
    subtitle: "M4 • 16GB RAM • 256GB",
    description:
      "A lightweight and powerful MacBook Air powered by Apple's M4 chip. This configuration includes 16GB of RAM and 256GB of storage, making it suitable for everyday productivity, creative work, development, and entertainment.",
    category: "Electronics",
    image: "/images/macbook.jpg",
    time: "11:18:09",
    participants: 673,
    entry: "25 ETB",
  },

  {
    id: "M006",
    title: "PlayStation 5",
    subtitle: "Slim Edition • 1TB",
    description:
      "Take your gaming experience to the next level with the PlayStation 5 Slim Edition. Featuring 1TB of storage, fast loading times, immersive graphics, and access to a huge library of games, this console is built for next-generation gaming.",
    category: "Electronics",
    image: "/images/ps5.jpg",
    time: "14:52:31",
    participants: 721,
    entry: "25 ETB",
  },
];