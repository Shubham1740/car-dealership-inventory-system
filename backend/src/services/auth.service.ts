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

const toSafeUser = (user: IUser): SafeUser => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
});

export const registerUser = async (input: RegisterInput): Promise<SafeUser> => {
  const user = await User.create({
    email: input.email,
    password: input.password,
  });

  return toSafeUser(user);
};