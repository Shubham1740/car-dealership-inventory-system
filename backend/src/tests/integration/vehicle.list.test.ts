import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../app';
import Vehicle from '../../models/vehicle.model';

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  token = jwt.sign({ id: 'user1', role: 'user' }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

describe('GET /api/vehicles', () => {
  it('should return an empty list when no vehicles exist', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
  });

  it('should return all vehicles when authenticated', async () => {
    await Vehicle.create({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });
    await Vehicle.create({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 18000, quantity: 3 });

    const response = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(401);
  });
});