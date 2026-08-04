import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  isFeaturedOnHome: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    isFeaturedOnHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
