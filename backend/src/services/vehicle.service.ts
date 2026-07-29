import Vehicle, { IVehicle } from '../models/vehicle.model';

interface CreateVehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity?: number;
}

interface SafeVehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

const toSafeVehicle = (vehicle: IVehicle): SafeVehicle => ({
  id: vehicle._id.toString(),
  make: vehicle.make,
  model: vehicle.model,
  category: vehicle.category,
  price: vehicle.price,
  quantity: vehicle.quantity,
});

export const createVehicle = async (input: CreateVehicleInput): Promise<SafeVehicle> => {
  const vehicle = await Vehicle.create(input);
  return toSafeVehicle(vehicle);
};