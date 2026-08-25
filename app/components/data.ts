export type Auction = {
  id: string;
  title: string;
  subtitle: string;
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
    category: "Automotive",
    image: "/images/byd.jpg",
    time: "2d 08:24:12",
    participants: 1248,
    entry: "100 ETB",
  },

  {
    id: "M004",
    title: "LG Smart Refrigerator",
    subtitle: "450L • Inverter",
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
    category: "Electronics",
    image: "/images/ps5.jpg",
    time: "14:52:31",
    participants: 721,
    entry: "25 ETB",
  },

];