import { Schema, model } from 'mongoose';

const CarSchema = new Schema(
  {
    automaker: { type: String, required: true },
    engine: { type: String, required: true },
    year: { type: Number, required: true },
    cylinder: { type: Number, required: true },
    gear: { type: Number, required: true },
    motor_oil: { type: Number, required: true },
    oil_quantity: { type: Number, required: true },
    oil: { type: Schema.Types.ObjectId, ref: 'Oil' },
    oilFilter: { type: Schema.Types.ObjectId, ref: 'OilFilter' },
  },
  {
    timestamps: true,
  },
);

export default model('Car', CarSchema);
