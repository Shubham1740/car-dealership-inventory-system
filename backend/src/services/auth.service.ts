import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

interface RegisterInput {
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SafeUser {
  id: string;
  email: string;
  role: string;
}

interface LoginResult {
  token: string;
  user: SafeUser;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super('Email is already registered');
    this.name = 'DuplicateEmailError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

const toSafeUser = (user: IUser): SafeUser => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
});

const signToken = (user: IUser): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];

  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn }
  );
};

export const registerUser = async (input: RegisterInput): Promise<SafeUser> => {
  try {
    const user = await User.create({
      email: input.email,
      password: input.password,
    });

    return toSafeUser(user);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new DuplicateEmailError();
    }
    throw error;
  }
};

export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
  const user = await User.findOne({ email: input.email });

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isMatch = await user.comparePassword(input.password);

  if (!isMatch) {
    throw new InvalidCredentialsError();
  }

  return {
    token: signToken(user),
    user: toSafeUser(user),
  };
};