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

describe('POST /api/vehicles/:id/purchase', () => {
  it('should decrement quantity by 1 on purchase', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.quantity).toBe(4);
  });

  it('should return 400 when quantity is already 0', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 0,
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);

    const found = await Vehicle.findById(vehicle._id);
    expect(found?.quantity).toBe(0); // must not go negative
  });

  it('should return 404 for a non-existent vehicle', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/vehicles/${fakeId}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should return 401 when no token is provided', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app).post(`/api/vehicles/${vehicle._id}/purchase`);

    expect(response.status).toBe(401);
  });
});