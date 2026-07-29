import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import {
    fetchVehicles,
    searchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
} from '../api/vehicles';
import type { Vehicle } from '../api/vehicles';

vi.mock('../api/vehicles');

// Minimal unsigned JWT with a role claim in the payload, for decodeToken to read.
function makeToken(role: string): string {
    const payload = btoa(JSON.stringify({ role }));
    return `header.${payload}.signature`;
}

const mockVehicles: Vehicle[] = [
    { id: '1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 21000, quantity: 3 },
    { id: '2', make: 'Honda', model: 'Civic', category: 'Sedan', price: 23500, quantity: 0 },
];

const renderDashboard = () =>
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );

describe('Dashboard page', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    });

    it('renders a welcome message', () => {
        renderDashboard();
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('renders a logout button', () => {
        renderDashboard();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    it('clears the token from localStorage on logout click', async () => {
        localStorage.setItem('token', 'jwt-token');
        const user = userEvent.setup();

        renderDashboard();

        await user.click(screen.getByRole('button', { name: /log out/i }));

        expect(localStorage.getItem('token')).toBeNull();
    });

    describe('vehicle list', () => {
        it('shows a loading state before vehicles arrive', () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => { }));
            renderDashboard();
            expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument();
        });

        it('renders each vehicle after fetch resolves', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            renderDashboard();
            expect(await screen.findByText(/Toyota Corolla/i)).toBeInTheDocument();
            expect(screen.getByText(/Honda Civic/i)).toBeInTheDocument();
        });

        it('shows an error message if the fetch fails', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network error'));
            renderDashboard();
            expect(await screen.findByText(/couldn't load vehicles/i)).toBeInTheDocument();
        });

        it('shows an empty state when there are no vehicles', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);
            renderDashboard();
            expect(await screen.findByText(/no vehicles found/i)).toBeInTheDocument();
        });

        it('disables the purchase button when quantity is 0', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            renderDashboard();
            const civicRow = (await screen.findByText(/Honda Civic/i)).closest('[data-testid="vehicle-row"]') as HTMLElement;
            expect(within(civicRow).getByRole('button', { name: /purchase/i })).toBeDisabled();
        });

        it('calls purchaseVehicle and updates quantity on click', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            (purchaseVehicle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ...mockVehicles[0], quantity: 2 });

            const user = userEvent.setup();
            renderDashboard();

            const corollaRow = (await screen.findByText(/Toyota Corolla/i)).closest('[data-testid="vehicle-row"]') as HTMLElement;
            await user.click(within(corollaRow).getByRole('button', { name: /purchase/i }));

            await waitFor(() => expect(purchaseVehicle).toHaveBeenCalledWith('1'));
            expect(await within(corollaRow).findByText(/quantity: 2/i)).toBeInTheDocument();
        });
    });

    describe('search and filter', () => {
        it('calls searchVehicles with entered filters on submit', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);
            (searchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce([mockVehicles[0]]);

            const user = userEvent.setup();
            renderDashboard();
            await screen.findByText(/no vehicles found/i);

            await user.type(screen.getByLabelText(/search by make/i), 'Toyota');
            await user.click(screen.getByRole('button', { name: /^search$/i }));

            await waitFor(() =>
                expect(searchVehicles).toHaveBeenCalledWith(
                    expect.objectContaining({ make: 'Toyota' })
                )
            );
            expect(await screen.findByText(/Toyota Corolla/i)).toBeInTheDocument();
        });

        it('clears filters and reloads the full list', async () => {
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValue(mockVehicles);

            const user = userEvent.setup();
            renderDashboard();
            await screen.findByText(/Toyota Corolla/i);

            await user.type(screen.getByLabelText(/search by make/i), 'Toyota');
            await user.click(screen.getByRole('button', { name: /clear filters/i }));

            expect(screen.getByLabelText(/search by make/i)).toHaveValue('');
            await waitFor(() => expect(fetchVehicles).toHaveBeenCalledTimes(2));
        });
    });

    describe('admin controls', () => {
        it('does not show admin controls for a non-admin user', async () => {
            localStorage.setItem('token', makeToken('user'));
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            renderDashboard();

            await screen.findByText(/Toyota Corolla/i);
            expect(screen.queryByRole('button', { name: /\+ add vehicle/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
        });

        it('shows admin controls for an admin user', async () => {
            localStorage.setItem('token', makeToken('admin'));
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            renderDashboard();

            await screen.findByText(/Toyota Corolla/i);
            expect(screen.getByRole('button', { name: /\+ add vehicle/i })).toBeInTheDocument();
            expect(screen.getAllByRole('button', { name: /^delete$/i }).length).toBe(mockVehicles.length);
        });

        it('submits the add form and appends the new vehicle', async () => {
            localStorage.setItem('token', makeToken('admin'));
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            const newVehicle: Vehicle = { id: '3', make: 'Ford', model: 'Focus', category: 'Hatchback', price: 18000, quantity: 5 };
            (createVehicle as ReturnType<typeof vi.fn>).mockResolvedValueOnce(newVehicle);

            const user = userEvent.setup();
            renderDashboard();
            await screen.findByText(/Toyota Corolla/i);

            await user.click(screen.getByRole('button', { name: /\+ add vehicle/i }));
            await user.type(screen.getByLabelText(/^make$/i), 'Ford');
            await user.type(screen.getByLabelText(/^model$/i), 'Focus');
            await user.type(screen.getByLabelText(/^category$/i), 'Hatchback');
            await user.type(screen.getByLabelText(/^price$/i), '18000');
            await user.type(screen.getByLabelText(/^quantity$/i), '5');
            await user.click(screen.getByRole('button', { name: /^add vehicle$/i }));

            await waitFor(() =>
                expect(createVehicle).toHaveBeenCalledWith({
                    make: 'Ford',
                    model: 'Focus',
                    category: 'Hatchback',
                    price: 18000,
                    quantity: 5,
                })
            );
            expect(await screen.findByText(/Ford Focus/i)).toBeInTheDocument();
        });

        it('edits a vehicle via the inline form', async () => {
            localStorage.setItem('token', makeToken('admin'));
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            (updateVehicle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ...mockVehicles[0], price: 19999 });

            const user = userEvent.setup();
            renderDashboard();
            await screen.findByText(/Toyota Corolla/i);

            const corollaRow = (await screen.findByText(/Toyota Corolla/i)).closest('[data-testid="vehicle-row"]') as HTMLElement;
            await user.click(within(corollaRow).getByRole('button', { name: /^edit$/i }));

            const priceInput = screen.getByLabelText(/^price$/i);
            await user.clear(priceInput);
            await user.type(priceInput, '19999');
            await user.click(screen.getByRole('button', { name: /save changes/i }));

            await waitFor(() =>
                expect(updateVehicle).toHaveBeenCalledWith(
                    '1',
                    expect.objectContaining({ price: 19999 })
                )
            );
        });

        it('deletes a vehicle after confirmation', async () => {
            localStorage.setItem('token', makeToken('admin'));
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            (deleteVehicle as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
            vi.spyOn(window, 'confirm').mockReturnValue(true);

            const user = userEvent.setup();
            renderDashboard();
            const corollaRow = (await screen.findByText(/Toyota Corolla/i)).closest('[data-testid="vehicle-row"]') as HTMLElement;

            await user.click(within(corollaRow).getByRole('button', { name: /^delete$/i }));

            await waitFor(() => expect(deleteVehicle).toHaveBeenCalledWith('1'));
            await waitFor(() => expect(screen.queryByText(/Toyota Corolla/i)).not.toBeInTheDocument());
        });

        it('restocks a vehicle with the entered amount', async () => {
            localStorage.setItem('token', makeToken('admin'));
            (fetchVehicles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockVehicles);
            (restockVehicle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ...mockVehicles[1], quantity: 5 });

            const user = userEvent.setup();
            renderDashboard();
            const civicRow = (await screen.findByText(/Honda Civic/i)).closest('[data-testid="vehicle-row"]') as HTMLElement;

            const restockInput = within(civicRow).getByLabelText(/restock amount/i);
            await user.type(restockInput, '5');
            await user.click(within(civicRow).getByRole('button', { name: /^restock$/i }));

            await waitFor(() => expect(restockVehicle).toHaveBeenCalledWith('2', 5));
            expect(await within(civicRow).findByText(/quantity: 5/i)).toBeInTheDocument();
        });
    });
});