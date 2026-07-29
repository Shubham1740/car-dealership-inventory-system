import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  VehicleNotFoundError,
  OutOfStockError,
  InvalidQuantityError,
} from '../services/vehicle.service';
import { catchAsync } from '../utils/catchAsync';

export const create = catchAsync(async (req, res) => {
  const { make, model, category, price, quantity } = req.body;
  const vehicle = await createVehicle({ make, model, category, price, quantity });

  res.status(201).json({ success: true, data: vehicle });
});


export const list = catchAsync(async (_req, res) => {
  const vehicles = await getAllVehicles();
  res.status(200).json({ success: true, data: vehicles });
});

export const search = catchAsync(async (req, res) => {
  const { make, model, category, minPrice, maxPrice } = req.query;

  const vehicles = await searchVehicles({
    make: make as string | undefined,
    model: model as string | undefined,
    category: category as string | undefined,
    minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
  });

  res.status(200).json({ success: true, data: vehicles });
});

export const update = catchAsync(async (req, res) => {
  const vehicle = await updateVehicle(req.params.id, req.body);
  res.status(200).json({ success: true, data: vehicle });
});

export const remove = catchAsync(async (req, res) => {
  await deleteVehicle(req.params.id);
  res.status(200).json({ success: true, message: 'Vehicle deleted' });
});

export const purchase = catchAsync(async (req, res) => {
  const vehicle = await purchaseVehicle(req.params.id);
  res.status(200).json({ success: true, data: vehicle });
});

export const restock = catchAsync(async (req, res) => {
  const vehicle = await restockVehicle(req.params.id, req.body.quantity);
  res.status(200).json({ success: true, data: vehicle });
});