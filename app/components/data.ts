export type Auction = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  time: string;
  participants: number;
  bidCount: number;
  entry: string;
  endsAt?: string;
  featured?: boolean;
};