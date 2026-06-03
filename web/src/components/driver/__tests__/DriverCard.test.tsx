import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DriverCard from '../DriverCard';
import type { Driver } from '../../company/DriverInfo';

const makeDriver = (overrides: Partial<Driver> = {}): Driver => ({
    id: 1,
    firstName: 'Ivan',
    lastName: 'Petrov',
    phoneNumber: '+359888100100',
    expertiseType: ['B'],
    available: true,
    companyId: 1,
    vehicleIds: [10, 11],
    ...overrides,
});

describe('DriverCard', () => {
    it('renders the photo container with portrait orientation (h-72)', () => {
        const { container } = render(
            <DriverCard driver={makeDriver()} index={0} onEdit={vi.fn()} onDelete={vi.fn()} onAssign={vi.fn()} />
        );
        const imgWrapper = container.querySelector('img')?.parentElement;
        expect(imgWrapper).not.toBeNull();
        expect(imgWrapper?.className).toContain('h-72');
        expect(imgWrapper?.className).not.toContain('h-48');
    });

    it('renders driver image with name as alt text', () => {
        render(<DriverCard driver={makeDriver()} index={0} onEdit={vi.fn()} onDelete={vi.fn()} onAssign={vi.fn()} />);
        expect(screen.getByAltText('Ivan Petrov')).toBeInTheDocument();
    });

    it('renders name, phone and expertise', () => {
        render(<DriverCard driver={makeDriver()} index={0} onEdit={vi.fn()} onDelete={vi.fn()} onAssign={vi.fn()} />);
        expect(screen.getByText('Ivan Petrov')).toBeInTheDocument();
        expect(screen.getByText('+359888100100')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
    });
});
