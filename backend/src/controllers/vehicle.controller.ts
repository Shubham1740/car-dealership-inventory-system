import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createVehicle } from '../services/vehicle.service';

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