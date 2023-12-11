import { Schema, model } from 'mongoose';

const StoreSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    cnpj: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

export default model('Store', StoreSchema);
