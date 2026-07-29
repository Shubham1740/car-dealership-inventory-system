import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createVehicle, getAllVehicles, searchVehicles, updateVehicle, VehicleNotFoundError } from '../services/vehicle.service';

export const create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { make, model, category, price, quantity } = req.body;
    const vehicle = await createVehicle({ make, model, category, price, quantity });

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create vehicle',
    });
  }
};

export const list = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const vehicles = await getAllVehicles();

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles',
    });
  }
};

export const search = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const vehicles = await searchVehicles({
      make: make as string | undefined,
      model: model as string | undefined,
      category: category as string | undefined,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    });

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to search vehicles',
    });
  }
};

export const update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const vehicle = await updateVehicle(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error instanceof VehicleNotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update vehicle',
    });
  }
};