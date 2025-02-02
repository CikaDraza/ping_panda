import mongoose, { Schema, Document } from 'mongoose';

export interface IEventCategory extends Document {
  eventsThisMonth: number;
  uniqueFields: number;
  lastPing: string | number | Date | null;
  map: any;
  _id: string;
  name: string;
  color: number;
  emoji?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventCategorySchema = new Schema<IEventCategory>({
  name: { type: String, required: true },
  color: { type: Number, required: true },
  emoji: { type: String, sparse: true },
  userId: { type: String, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

eventCategorySchema.index({ name: 1, userId: 1 });

const EventCategory = mongoose.models.EventCategory || mongoose.model<IEventCategory>('EventCategory', eventCategorySchema);

export default EventCategory;
