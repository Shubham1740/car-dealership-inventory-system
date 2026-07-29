import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/user.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User model', () => {
  it('should create a user with valid email and password', async () => {
    const user = await User.create({
      email: 'driver@example.com',
      password: 'password123',
    });

    expect(user.email).toBe('driver@example.com');
    expect(user.role).toBe('user');
  });

  it('should reject a user without an email', async () => {
    await expect(
      User.create({ password: 'password123' })
    ).rejects.toThrow();
  });

  it('should reject a user without a password', async () => {
    await expect(
      User.create({ email: 'driver@example.com' })
    ).rejects.toThrow();
  });

  it('should reject a duplicate email', async () => {
    await User.create({ email: 'driver@example.com', password: 'password123' });
    await expect(
      User.create({ email: 'driver@example.com', password: 'password456' })
    ).rejects.toThrow();
  });

  it('should reject a password shorter than 6 characters', async () => {
    await expect(
      User.create({ email: 'driver@example.com', password: '123' })
    ).rejects.toThrow();
  });
});