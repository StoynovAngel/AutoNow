import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import CompanyCard from './CompanyCard';
import { VehicleType } from '../../types/vehicle';
import type { Company } from '../../types/company';

const baseCompany: Company = {
    id: 1,
    name: 'Acme Taxi',
    phone: '+1-555-0100',
    companyType: VehicleType.TAXI,
};

describe('CompanyCard', () => {
    it('renders the company name and the call button', () => {
        const onCall = jest.fn();
        const { getByText, getByTestId } = renderWithProviders(
            <CompanyCard company={baseCompany} onCall={onCall} />,
        );

        expect(getByText('Acme Taxi')).toBeTruthy();
        expect(getByTestId('icon-phone')).toBeTruthy();
    });

    it('shows description and address when present', () => {
        const company: Company = {
            ...baseCompany,
            description: 'Fast rides',
            address: '1 Main St',
        };
        const { getByText } = renderWithProviders(<CompanyCard company={company} onCall={jest.fn()} />);

        expect(getByText('Fast rides')).toBeTruthy();
        expect(getByText('1 Main St')).toBeTruthy();
    });

    it('formats rating to one decimal when provided', () => {
        const company: Company = { ...baseCompany, rating: 4.567 };
        const { getByText } = renderWithProviders(<CompanyCard company={company} onCall={jest.fn()} />);

        expect(getByText('4.6')).toBeTruthy();
    });

    it('formats distance with unit when provided', () => {
        const company: Company = { ...baseCompany, distance: 2.345 };
        const { getByText } = renderWithProviders(<CompanyCard company={company} onCall={jest.fn()} />);

        expect(getByText('2.3 km')).toBeTruthy();
    });

    it('does not render rating or distance when undefined', () => {
        const { queryByTestId } = renderWithProviders(
            <CompanyCard company={baseCompany} onCall={jest.fn()} />,
        );
        expect(queryByTestId('icon-star')).toBeNull();
        expect(queryByTestId('icon-directions')).toBeNull();
    });

    it('calls onCall with the phone number when the call button is pressed', () => {
        const onCall = jest.fn();
        const { getByTestId } = renderWithProviders(
            <CompanyCard company={baseCompany} onCall={onCall} />,
        );

        fireEvent.press(getByTestId('icon-phone').parent!);

        expect(onCall).toHaveBeenCalledWith('+1-555-0100');
    });

    it('does not render the Book button when onBook is omitted', () => {
        const { queryByTestId } = renderWithProviders(
            <CompanyCard company={baseCompany} onCall={jest.fn()} />,
        );
        expect(queryByTestId('book-1')).toBeNull();
    });

    it('renders the Book button when onBook is provided', () => {
        const { queryByTestId } = renderWithProviders(
            <CompanyCard company={baseCompany} onCall={jest.fn()} onBook={jest.fn()} />,
        );
        expect(queryByTestId('book-1')).toBeTruthy();
    });

    it('calls onBook with the company id when Book is pressed', () => {
        const onBook = jest.fn();
        const { getByTestId } = renderWithProviders(
            <CompanyCard company={baseCompany} onCall={jest.fn()} onBook={onBook} />,
        );
        fireEvent.press(getByTestId('book-1'));
        expect(onBook).toHaveBeenCalledWith(1);
    });
});
