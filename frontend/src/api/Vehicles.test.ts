import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import {
  fetchVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from './vehicles';
import type { Vehicle } from './vehicles';

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockVehicle: Vehicle = {
  id: '1',
  make: 'Toyota',
  model: 'Corolla',
  category: 'Sedan',
  price: 21000,
  quantity: 3,
};

describe('vehicles API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchVehicles calls GET /vehicles', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true, data: [mockVehicle] } });
    const result = await fetchVehicles();
    expect(apiClient.get).toHaveBeenCalledWith('/vehicles');
    expect(result).toEqual([mockVehicle]);
  });

  it('searchVehicles calls GET /vehicles/search with query params', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true, data: [mockVehicle] } });
    const params = { make: 'Toyota', minPrice: 10000 };
    const result = await searchVehicles(params);
    expect(apiClient.get).toHaveBeenCalledWith('/vehicles/search', { params });
    expect(result).toEqual([mockVehicle]);
  });

  it('createVehicle calls POST /vehicles with the input', async () => {
    const input = { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 21000, quantity: 3 };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true, data: mockVehicle } });
    const result = await createVehicle(input);
    expect(apiClient.post).toHaveBeenCalledWith('/vehicles', input);
    expect(result).toEqual(mockVehicle);
  });

  it('updateVehicle calls PUT /vehicles/:id with the input', async () => {
    const input = { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 2 };
    const updated = { ...mockVehicle, ...input };
    (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true, data: updated } });
    const result = await updateVehicle('1', input);
    expect(apiClient.put).toHaveBeenCalledWith('/vehicles/1', input);
    expect(result).toEqual(updated);
  });

  it('deleteVehicle calls DELETE /vehicles/:id', async () => {
    (apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
    await deleteVehicle('1');
    expect(apiClient.delete).toHaveBeenCalledWith('/vehicles/1');
  });

  it('purchaseVehicle calls POST /vehicles/:id/purchase', async () => {
    const updated = { ...mockVehicle, quantity: 2 };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true, data: updated } });
    const result = await purchaseVehicle('1');
    expect(apiClient.post).toHaveBeenCalledWith('/vehicles/1/purchase');
    expect(result).toEqual(updated);
  });

  it('restockVehicle calls POST /vehicles/:id/restock with a quantity', async () => {
    const updated = { ...mockVehicle, quantity: 8 };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true, data: updated } });
    const result = await restockVehicle('1', 5);
    expect(apiClient.post).toHaveBeenCalledWith('/vehicles/1/restock', { quantity: 5 });
    expect(result).toEqual(updated);
  });
});