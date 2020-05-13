import mongoose, { Schema } from 'mongoose';

export type ItemDocument = mongoose.Document & {
  feature: string;
  category: string;
  price: number;
  image: string;
  data: string;
};

const ItemSchema = new Schema(
  {
    item_name: String,
    category: String,
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    data: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'Items' }
);

export const Item = mongoose.model<ItemDocument>('Item', ItemSchema);
