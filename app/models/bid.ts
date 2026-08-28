import mongoose, { Document, Model, Schema } from "mongoose";

export type BidStatus = "accepted" | "rejected";

export interface IBid extends Document {
  auctionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new Schema<IBid>(
  {
    auctionId: { type: Schema.Types.ObjectId, ref: "Auction", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01, max: 100000000 },
    status: { type: String, enum: ["accepted", "rejected"], default: "accepted" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BidSchema.index({ auctionId: 1, createdAt: 1 });
BidSchema.index({ userId: 1, createdAt: 1 });

const Bid: Model<IBid> =
  mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);

export default Bid;