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
  it('should register a new user and return 201 with no password in the response', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'driver@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('driver@example.com');
    expect(response.body.data.role).toBe('user');
    expect(response.body.data.password).toBeUndefined();

    const userInDb = await User.findOne({ email: 'driver@example.com' });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.password).not.toBe('password123'); // must be hashed
  });
});