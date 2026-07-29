import { Schema, model as mongooseModel, Document } from 'mongoose';

export interface IVehicle extends Omit<Document, 'model'> {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
  },
  { timestamps: true }
);

export default mongooseModel<IVehicle>('Vehicle', vehicleSchema);