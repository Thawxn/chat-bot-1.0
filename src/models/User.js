import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export default model('User', UserSchema);
