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

describe('PUT /api/vehicles/:id', () => {
  it('should update a vehicle with valid data', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 21000 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.price).toBe(21000);
    expect(response.body.data.model).toBe('Corolla'); // unchanged field preserved
  });

  it('should return 404 for a non-existent vehicle', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put(`/api/vehicles/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 21000 });

    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid update data', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: -500 });

    expect(response.status).toBe(400);
  });

  it('should return 401 when no token is provided', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .send({ price: 21000 });

    expect(response.status).toBe(401);
  });
});