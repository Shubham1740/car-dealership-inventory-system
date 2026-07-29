import { Request, Response } from 'express';
import { registerUser, loginUser, DuplicateEmailError, InvalidCredentialsError } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser({ email, password });

  res.status(201).json({
    success: true,
    data: user,
  });
});


export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
    return;
  }
  const result = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    data: result,
  });
});