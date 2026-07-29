import User, { IUser } from '../models/user.model';

interface RegisterInput {
  email: string;
  password: string;
}

interface SafeUser {
  id: string;
  email: string;
  role: string;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super('Email is already registered');
    this.name = 'DuplicateEmailError';
  }
}

const toSafeUser = (user: IUser): SafeUser => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
});

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