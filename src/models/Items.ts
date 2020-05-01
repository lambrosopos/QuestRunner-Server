import mongoose, { Schema } from "mongoose";

export type ItemDocument = mongoose.Document & {
  feature: string;
  category: string;
  price: number;
  image: string;
};

const ItemSchema = new Schema(
  {
    feature: String,
    category: String,
    price: Number,
    image: String,
    created_at: { type: Date, default: Date.now },
  },
  { collection: "Items" }
);

export const Item = mongoose.model<ItemDocument>("Item", ItemSchema);
