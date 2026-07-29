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

describe('POST /api/vehicles', () => {
  it('should create a vehicle when authenticated', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 20000,
        quantity: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.make).toBe('Toyota');
    expect(response.body.data.quantity).toBe(5);
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app).post('/api/vehicles').send({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 20000,
      quantity: 5,
    });

    expect(response.status).toBe(401);
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});