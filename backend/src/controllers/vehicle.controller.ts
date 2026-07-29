import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createVehicle, getAllVehicles } from '../services/vehicle.service';

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