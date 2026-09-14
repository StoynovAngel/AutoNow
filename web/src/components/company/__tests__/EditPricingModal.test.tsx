import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditPricingModal from '../EditPricingModal';

const noop = vi.fn();

const renderModal = (companyType: 'TAXI' | 'AMBULANCE' | 'LOGISTICS') =>
    render(
        <EditPricingModal
            show
            pricing={null}
            companyType={companyType}
            onClose={noop}
            onSubmit={vi.fn()}
        />,
    );

describe('EditPricingModal — numeric bound guards', () => {
    it('constrains night hours to 0-23 for a TAXI company', () => {
        renderModal('TAXI');
        const start = screen.getByLabelText(/night start hour/i) as HTMLInputElement;
        const end = screen.getByLabelText(/night end hour/i) as HTMLInputElement;
        expect(start.getAttribute('min')).toBe('0');
        expect(start.getAttribute('max')).toBe('23');
        expect(end.getAttribute('min')).toBe('0');
        expect(end.getAttribute('max')).toBe('23');
    });

    it('sets a lower bound of 0 on fares and 1 on night multiplier', () => {
        renderModal('TAXI');
        const baseFare = screen.getByLabelText(/base fare/i) as HTMLInputElement;
        const multiplier = screen.getByLabelText(/night multiplier/i) as HTMLInputElement;
        expect(baseFare.getAttribute('min')).toBe('0');
        expect(baseFare.type).toBe('number');
        expect(multiplier.getAttribute('min')).toBe('1');
    });
});
