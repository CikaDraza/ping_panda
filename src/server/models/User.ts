import mongoose, { Schema, Document } from 'mongoose';
import cuid from 'cuid';

enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
}

export { Plan };

export interface IUser extends Document {
  externalId?: string;
  apiKey: string;
  email: string;
  discordId?: string;
  quotaLimit: number;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  externalId: { type: String, unique: true, sparse: true },
  apiKey: { type: String, required: true, unique: true, default: () => cuid() },
  email: { type: String, required: true, unique: true },
  discordId: { type: String, sparse: true }, 
  quotaLimit: { type: Number, required: true, default: 1000 },
  plan: { type: String, enum: Plan, default: Plan.FREE },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Relacije
userSchema.virtual('eventCategories', {
  ref: 'EventCategory',
  localField: '_id',
  foreignField: 'userId',
});

userSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'userId',
});

userSchema.virtual('quota', {
  ref: 'Quota',
  localField: '_id',
  foreignField: 'userId',
});

userSchema.index({ email: 1, apiKey: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
