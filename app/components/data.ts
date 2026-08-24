export type Auction = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  time: string;
  participants: string;
  entry: string;
};

export const auctions: Auction[] = [
  {
    id: "001",
    category: "ELECTRONICS",
    title: "iPhone 17 Pro Max",
    subtitle: "256GB · Titanium",
    image: "/images/iphone.avif",
    time: "02 : 14 : 36",
    participants: "1,284",
    entry: "75 ETB",
  },
  {
    id: "002",
    category: "AUTOMOTIVE",
    title: "BYD Seagull",
    subtitle: "2026 · Electric",
    image: "/images/byd.jpg",
    time: "14 : 08 : 51",
    participants: "742",
    entry: "150 ETB",
  },
  {
    id: "003",
    category: "HOME",
    title: "Samsung Neo QLED",
    subtitle: "65″ · 4K Smart TV",
    image: "/images/tv.jpg",
    time: "01 : 03 : 24",
    participants: "518",
    entry: "75 ETB",
  },
];