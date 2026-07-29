import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../app';
import Vehicle from '../../models/vehicle.model';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  adminToken = jwt.sign({ id: 'admin1', role: 'admin' }, process.env.JWT_SECRET as string);
  userToken = jwt.sign({ id: 'user1', role: 'user' }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

describe('DELETE /api/vehicles/:id', () => {
  it('should delete a vehicle when requested by an admin', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const found = await Vehicle.findById(vehicle._id);
    expect(found).toBeNull();
  });

  it('should return 403 when requested by a non-admin user', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    const found = await Vehicle.findById(vehicle._id);
    expect(found).not.toBeNull(); // must not have been deleted
  });

  it('should return 401 when no token is provided', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5,
    });

    const response = await request(app).delete(`/api/vehicles/${vehicle._id}`);

    expect(response.status).toBe(401);
  });

  it('should return 404 for a non-existent vehicle', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/vehicles/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });
});