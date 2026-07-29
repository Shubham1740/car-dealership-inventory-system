import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    fetchVehicles,
    searchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
} from '../api/vehicles';
import type { Vehicle, VehicleInput, VehicleSearchParams } from '../api/vehicles';
import { getErrorMessage } from '../utils/getErrorMessage';

const emptyFilters = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };

interface VehicleFormProps {
    initialValues?: VehicleInput;
    onSubmit: (values: VehicleInput) => void;
    onCancel: () => void;
    submitLabel: string;
    isEditing?: boolean;
}

const VehicleForm = ({ initialValues, onSubmit, onCancel, submitLabel, isEditing = false }: VehicleFormProps) => {
    const [make, setMake] = useState(initialValues?.make ?? '');
    const [model, setModel] = useState(initialValues?.model ?? '');
    const [category, setCategory] = useState(initialValues?.category ?? '');
    const [price, setPrice] = useState(initialValues?.price?.toString() ?? '');
    const [quantity, setQuantity] = useState(initialValues?.quantity?.toString() ?? '0');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Quantity is only settable on create (initial stock). On edit, it's carried through
        // unchanged — stock changes must go through Purchase or the admin-only Restock action.
        onSubmit({
            make,
            model,
            category,
            price: Number(price),
            quantity: isEditing ? (initialValues?.quantity ?? 0) : Number(quantity),
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-4 mb-4"
        >
            <input
                aria-label="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="Make"
                required
                className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
            />
            <input
                aria-label="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Model"
                required
                className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
            />
            <input
                aria-label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                required
                className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
            />
            <input
                aria-label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                required
                min={0}
                className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
            />
            {!isEditing && (
                <input
                    aria-label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                    required
                    min={0}
                    className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
                />
            )}
            
            <div className="flex gap-2 col-span-2">
                <button
                    type="submit"
                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                >
                    {submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

const Dashboard = () => {
    const { logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    const [filters, setFilters] = useState(emptyFilters);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>({});

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const loadVehicles = async (params?: VehicleSearchParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const hasFilters = params && Object.values(params).some((v) => v !== undefined && v !== '');
            const data = hasFilters ? await searchVehicles(params!) : await fetchVehicles();
            setVehicles(data);
        } catch {
            setError("Couldn't load vehicles. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        loadVehicles({
            make: filters.make || undefined,
            model: filters.model || undefined,
            category: filters.category || undefined,
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        });
    };

    const handleClearFilters = () => {
        setFilters(emptyFilters);
        loadVehicles();
    };

    const handlePurchase = async (id: string) => {
        setPurchasingId(id);
        try {
            const updated = await purchaseVehicle(id);
            setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setPurchasingId(null);
        }
    };

    const handleAdd = async (values: VehicleInput) => {
        try {
            const created = await createVehicle(values);
            setVehicles((prev) => [...prev, created]);
            setShowAddForm(false);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleUpdate = async (id: string, values: VehicleInput) => {
        try {
            const updated = await updateVehicle(id, values);
            setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
            setEditingId(null);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            await deleteVehicle(id);
            setVehicles((prev) => prev.filter((v) => v.id !== id));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleRestock = async (id: string) => {
        const amount = Number(restockAmounts[id] ?? '1');
        try {
            const updated = await restockVehicle(id, amount);
            setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
            setRestockAmounts((prev) => ({ ...prev, [id]: '' }));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] bg-bg p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-ink">Welcome to your dashboard</h1>
                        <p className="text-sm text-muted mt-1">Inventory overview</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        Log Out
                    </button>
                </div>

                <form
                    onSubmit={handleSearchSubmit}
                    className="grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-lg border border-border bg-surface p-4 mb-6"
                >
                    <input
                        aria-label="Search by make"
                        value={filters.make}
                        onChange={(e) => setFilters((f) => ({ ...f, make: e.target.value }))}
                        placeholder="Make"
                        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
                    />
                    <input
                        aria-label="Search by model"
                        value={filters.model}
                        onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
                        placeholder="Model"
                        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
                    />
                    <input
                        aria-label="Search by category"
                        value={filters.category}
                        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                        placeholder="Category"
                        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
                    />
                    <input
                        aria-label="Minimum price"
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                        placeholder="Min price"
                        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
                    />
                    <input
                        aria-label="Maximum price"
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                        placeholder="Max price"
                        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
                    />
                    <div className="col-span-2 sm:col-span-5 flex gap-2">
                        <button
                            type="submit"
                            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink"
                        >
                            Clear filters
                        </button>
                    </div>
                </form>

                {/* Add Vehicle: available to any logged-in user (backend only restricts DELETE and RESTOCK to admins) */}
                <div className="mb-6">
                    {!showAddForm && (
                        <button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                        >
                            + Add Vehicle
                        </button>
                    )}
                    {showAddForm && (
                        <VehicleForm
                            submitLabel="Add Vehicle"
                            onSubmit={handleAdd}
                            onCancel={() => setShowAddForm(false)}
                        />
                    )}
                </div>

                {isLoading && (
                    <div className="rounded-lg border border-border bg-surface p-6">
                        <p className="text-muted">Loading vehicles…</p>
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-border bg-surface p-6 mb-4">
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {!isLoading && vehicles.length === 0 && (
                    <div className="rounded-lg border border-border bg-surface p-6">
                        <p className="text-muted">No vehicles found.</p>
                    </div>
                )}

                {!isLoading && vehicles.length > 0 && (
                    <ul className="space-y-3">
                        {vehicles.map((vehicle) =>
                            editingId === vehicle.id ? (
                                <li key={vehicle.id} data-testid="vehicle-row">
                                    <VehicleForm
                                        initialValues={vehicle}
                                        submitLabel="Save Changes"
                                        isEditing
                                        onSubmit={(values) => handleUpdate(vehicle.id, values)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                </li>
                            ) : (
                                <li
                                    key={vehicle.id}
                                    data-testid="vehicle-row"
                                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
                                >
                                    <div>
                                        <p className="font-medium text-ink">
                                            {vehicle.make} {vehicle.model}
                                        </p>
                                        <p className="text-sm text-muted">
                                            {vehicle.category} · ${vehicle.price.toLocaleString()} · Quantity: {vehicle.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handlePurchase(vehicle.id)}
                                            disabled={vehicle.quantity === 0 || purchasingId === vehicle.id}
                                            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {purchasingId === vehicle.id ? 'Purchasing…' : 'Purchase'}
                                        </button>

                                        {/* Edit: available to any logged-in user */}
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(vehicle.id)}
                                            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-bg"
                                        >
                                            Edit
                                        </button>

                                        {/* Restock and Delete: admin only, per backend spec */}
                                        {isAdmin && (
                                            <>
                                                <input
                                                    aria-label={`Restock amount for ${vehicle.make} ${vehicle.model}`}
                                                    type="number"
                                                    min={1}
                                                    value={restockAmounts[vehicle.id] ?? ''}
                                                    onChange={(e) =>
                                                        setRestockAmounts((prev) => ({ ...prev, [vehicle.id]: e.target.value }))
                                                    }
                                                    placeholder="Qty"
                                                    className="w-16 rounded-md border border-border bg-bg px-2 py-2 text-sm text-ink"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRestock(vehicle.id)}
                                                    className="rounded-md border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-bg"
                                                >
                                                    Restock
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    className="rounded-md bg-danger px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;