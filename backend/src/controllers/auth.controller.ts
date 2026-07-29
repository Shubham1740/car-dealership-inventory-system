import { Request, Response } from 'express';
import { registerUser, DuplicateEmailError } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await registerUser({ email, password });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};