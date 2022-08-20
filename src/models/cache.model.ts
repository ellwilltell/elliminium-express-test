import { model, Schema, Document } from 'mongoose';

export interface CacheDao {
  key: string;
  value: string;
  createdAt: Date;
  updateAt: Date;
}

const cacheSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const cacheModel = model<CacheDao & Document>('Cache', cacheSchema);

export default cacheModel;
