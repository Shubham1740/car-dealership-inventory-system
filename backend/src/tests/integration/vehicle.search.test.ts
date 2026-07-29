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

beforeEach(async () => {
  await Vehicle.create([
    { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 },
    { make: 'Toyota', model: 'Hilux', category: 'Truck', price: 35000, quantity: 2 },
    { make: 'Honda', model: 'Civic', category: 'Sedan', price: 18000, quantity: 3 },
  ]);
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

describe('GET /api/vehicles/search', () => {
  it('should filter by make', async () => {
    const response = await request(app)
      .get('/api/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it('should filter by category', async () => {
    const response = await request(app)
      .get('/api/vehicles/search?category=Sedan')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

    it('should filter by price range', async () => {
    const response = await request(app)
      .get('/api/vehicles/search?minPrice=30000&maxPrice=36000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].make).toBe('Toyota');
    expect(response.body.data[0].model).toBe('Hilux');
  });

  it('should combine multiple filters', async () => {
    const response = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=Sedan')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].model).toBe('Corolla');
  });

  it('should return all vehicles when no filters are provided', async () => {
    const response = await request(app)
      .get('/api/vehicles/search')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(3);
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app).get('/api/vehicles/search?make=Toyota');

    expect(response.status).toBe(401);
  });
});