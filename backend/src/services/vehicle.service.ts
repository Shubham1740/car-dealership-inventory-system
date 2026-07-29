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

export const getAllVehicles = async (): Promise<SafeVehicle[]> => {
  const vehicles = await Vehicle.find();
  return vehicles.map(toSafeVehicle);
};

interface SearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const searchVehicles = async (filters: SearchFilters): Promise<SafeVehicle[]> => {
  const query: Record<string, any> = {};

  if (filters.make) {
    query.make = { $regex: filters.make, $options: 'i' };
  }
  if (filters.model) {
    query.model = { $regex: filters.model, $options: 'i' };
  }
  if (filters.category) {
    query.category = { $regex: filters.category, $options: 'i' };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  const vehicles = await Vehicle.find(query);
  return vehicles.map(toSafeVehicle);
};

export class VehicleNotFoundError extends Error {
  constructor() {
    super('Vehicle not found');
    this.name = 'VehicleNotFoundError';
  }
}

interface UpdateVehicleInput {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export const updateVehicle = async (
  id: string,
  updates: UpdateVehicleInput
): Promise<SafeVehicle> => {
  const vehicle = await Vehicle.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw new VehicleNotFoundError();
  }

  return toSafeVehicle(vehicle);
};

export const deleteVehicle = async (id: string): Promise<void> => {
  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) {
    throw new VehicleNotFoundError();
  }
};

export class OutOfStockError extends Error {
  constructor() {
    super('Vehicle is out of stock');
    this.name = 'OutOfStockError';
  }
}

export const purchaseVehicle = async (id: string): Promise<SafeVehicle> => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new VehicleNotFoundError();
  }

  if (vehicle.quantity <= 0) {
    throw new OutOfStockError();
  }

  vehicle.quantity -= 1;
  await vehicle.save();

  return toSafeVehicle(vehicle);
};