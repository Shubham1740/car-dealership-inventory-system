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

describe('POST /api/auth/register', () => {
  it('should return 409 when email is already registered', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'driver@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/auth/register').send({
      email: 'driver@example.com',
      password: 'password456',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app).post('/api/auth/register').send({
      password: 'password123',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'driver@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should return 400 when password is shorter than 6 characters', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'driver@example.com',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});