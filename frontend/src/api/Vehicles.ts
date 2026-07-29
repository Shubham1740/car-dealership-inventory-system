import apiClient from './client';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await apiClient.get<ApiEnvelope<Vehicle[]>>('/vehicles');
  return response.data.data;
}

export async function searchVehicles(params: VehicleSearchParams): Promise<Vehicle[]> {
  const response = await apiClient.get<ApiEnvelope<Vehicle[]>>('/vehicles/search', { params });
  return response.data.data;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const response = await apiClient.post<ApiEnvelope<Vehicle>>('/vehicles', input);
  return response.data.data;
}

export async function updateVehicle(id: string, input: VehicleInput): Promise<Vehicle> {
  const response = await apiClient.put<ApiEnvelope<Vehicle>>(`/vehicles/${id}`, input);
  return response.data.data;
}

export async function deleteVehicle(id: string): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}

export async function purchaseVehicle(id: string): Promise<Vehicle> {
  const response = await apiClient.post<ApiEnvelope<Vehicle>>(`/vehicles/${id}/purchase`);
  return response.data.data;
}

export async function restockVehicle(id: string, quantity: number): Promise<Vehicle> {
  const response = await apiClient.post<ApiEnvelope<Vehicle>>(`/vehicles/${id}/restock`, { quantity });
  return response.data.data;
}