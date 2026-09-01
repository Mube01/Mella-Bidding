import mongoose, { Document, Model, Schema } from "mongoose";

export type AuctionStatus =
  | "upcoming"
  | "live"
  | "completed"
  | "cancelled";

export interface IAuction extends Document {
  publicId: string;
  title: { en: string; am: string };
  subtitle: { en: string; am: string };
  description: { en: string; am: string };
  category: string;

  // Main/cover image
  image: string;

  // Additional gallery images
  images: string[];

  entryCost: number;
  startsAt: Date;
  endsAt: Date;
  status: AuctionStatus;
  featured: boolean;
  participantCount: number;
  bidCount: number;
  winnerUserId?: mongoose.Types.ObjectId;
  winningBidId?: mongoose.Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AuctionSchema = new Schema<IAuction>(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    title: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160,
      },
      am: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160,
      },
    },

    subtitle: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: 240,
      },
      am: {
        type: String,
        required: true,
        trim: true,
        maxlength: 240,
      },
    },

    description: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },
      am: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // Main auction image
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // Additional auction images
    images: {
      type: [String],
      default: [],
    },

    entryCost: {
      type: Number,
      required: true,
      min: 0,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    endsAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed", "cancelled"],
      default: "upcoming",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    participantCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    bidCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    winnerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    winningBidId: {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

AuctionSchema.index({ status: 1, endsAt: 1 });

const Auction: Model<IAuction> =
  mongoose.models.Auction ||
  mongoose.model<IAuction>("Auction", AuctionSchema);

export default Auction;