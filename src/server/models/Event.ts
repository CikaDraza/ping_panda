import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  formattedMessage: string;
  userId: string;
  name: string;
  fields: object;
  deliveryStatus: 'PENDING' | 'DELIVERED' | 'FAILED';
  eventCategoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  formattedMessage: { type: String, required: true },
  userId: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  fields: { type: Schema.Types.Mixed, required: true },
  deliveryStatus: { type: String, enum: ['PENDING', 'DELIVERED', 'FAILED'], default: 'PENDING' },
  eventCategoryId: { type: String, ref: 'EventCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;