import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drivers from './Drivers';
import type { Driver } from '../components/company/DriverInfo';

vi.mock('../components/Navigation', () => ({
    default: () => <nav data-testid="nav" />,
}));

const mockDrivers: Driver[] = [
    { id: 1, firstName: 'Ivan', lastName: 'Petrov', phoneNumber: '+359888100100', expertiseType: 'B', available: true, companyId: 1, vehicleIds: [] },
    { id: 2, firstName: 'Maria', lastName: 'Ivanova', phoneNumber: '+359888100101', expertiseType: 'C', available: true, companyId: 1, vehicleIds: [] },
    { id: 3, firstName: 'Stefan', lastName: 'Dimitrov', phoneNumber: '+359888100102', expertiseType: 'B', available: false, companyId: 2, vehicleIds: [] },
];

vi.mock('../hooks/useAllDrivers', () => ({
    useAllDrivers: () => ({
        drivers: mockDrivers,
        loading: false,
        error: null,
        addDriver: vi.fn(),
        updateDriver: vi.fn(),
        removeDriver: vi.fn(),
        assignVehicle: vi.fn(),
        unassignVehicle: vi.fn(),
        refreshDrivers: vi.fn(),
    }),
}));

vi.mock('../hooks/useVehicles', () => ({
    useVehicles: () => ({ vehicles: [] }),
}));

describe('Drivers page — search by name', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all drivers initially', () => {
        render(<Drivers />);
        expect(screen.getByText('Ivan Petrov')).toBeInTheDocument();
        expect(screen.getByText('Maria Ivanova')).toBeInTheDocument();
        expect(screen.getByText('Stefan Dimitrov')).toBeInTheDocument();
    });

    it('renders search input in the filter row', () => {
        render(<Drivers />);
        expect(screen.getByLabelText(/search drivers by name/i)).toBeInTheDocument();
    });

    it('filters drivers by first name (case-insensitive)', async () => {
        const user = userEvent.setup();
        render(<Drivers />);
        await user.type(screen.getByLabelText(/search drivers by name/i), 'maria');
        expect(screen.getByText('Maria Ivanova')).toBeInTheDocument();
        expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument();
        expect(screen.queryByText('Stefan Dimitrov')).not.toBeInTheDocument();
    });

    it('filters drivers by last name', async () => {
        const user = userEvent.setup();
        render(<Drivers />);
        await user.type(screen.getByLabelText(/search drivers by name/i), 'dimitrov');
        expect(screen.getByText('Stefan Dimitrov')).toBeInTheDocument();
        expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument();
        expect(screen.queryByText('Maria Ivanova')).not.toBeInTheDocument();
    });

    it('filters by partial substring across full name', async () => {
        const user = userEvent.setup();
        render(<Drivers />);
        await user.type(screen.getByLabelText(/search drivers by name/i), 'iva');
        expect(screen.getByText('Ivan Petrov')).toBeInTheDocument();
        expect(screen.getByText('Maria Ivanova')).toBeInTheDocument();
        expect(screen.queryByText('Stefan Dimitrov')).not.toBeInTheDocument();
    });

    it('shows empty state when no driver matches', async () => {
        const user = userEvent.setup();
        render(<Drivers />);
        await user.type(screen.getByLabelText(/search drivers by name/i), 'zzznotfound');
        expect(screen.getByText('No drivers found')).toBeInTheDocument();
    });

    it('clear button resets the search', async () => {
        const user = userEvent.setup();
        render(<Drivers />);
        const searchInput = screen.getByLabelText(/search drivers by name/i);
        await user.type(searchInput, 'maria');
        expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /clear/i }));
        expect(screen.getByText('Ivan Petrov')).toBeInTheDocument();
        expect(searchInput).toHaveValue('');
    });
});
