import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Vehicle from '../../models/vehicle.model';

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
  await Vehicle.deleteMany({});
});

describe('Vehicle model', () => {
  it('should create a vehicle with valid fields', async () => {
    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 20000,
      quantity: 5,
    });

    expect(vehicle.make).toBe('Toyota');
    expect(vehicle.quantity).toBe(5);
  });

  it('should default quantity to 0 when not provided', async () => {
    const vehicle = await Vehicle.create({
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 18000,
    });

    expect(vehicle.quantity).toBe(0);
  });

  it('should reject a vehicle missing required fields', async () => {
    await expect(
      Vehicle.create({ make: 'Toyota' })
    ).rejects.toThrow();
  });

  it('should reject a negative price', async () => {
    await expect(
      Vehicle.create({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: -100,
        quantity: 5,
      })
    ).rejects.toThrow();
  });

  it('should reject a negative quantity', async () => {
    await expect(
      Vehicle.create({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 20000,
        quantity: -1,
      })
    ).rejects.toThrow();
  });
});