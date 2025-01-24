import mongoose, { Schema, Document } from 'mongoose';

export interface IQuota extends Document {
  userId: string;
  year: number;
  month: number;
  count: number;
  updatedAt: Date;
}

const quotaSchema = new Schema<IQuota>({
  userId: { type: String, required: true, ref: 'User' },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

quotaSchema.index({ userId: 1, year: 1, month: 1 });

const Quota = mongoose.model<IQuota>('Quota', quotaSchema);

export default Quota;