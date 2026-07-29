import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
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

describe('POST /api/auth/login', () => {
  it('should return 401 for a wrong password', async () => {
    await User.create({ email: 'driver@example.com', password: 'password123' });

    const response = await request(app).post('/api/auth/login').send({
      email: 'driver@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return 401 for an unknown email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return 400 when email or password is missing', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'driver@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});