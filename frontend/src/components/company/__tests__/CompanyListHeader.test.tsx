import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import CompanyListHeader from '../CompanyListHeader';
import { VehicleType } from '../../../types/vehicle';
import type { VehicleOption } from '../../../types/vehicle';

const taxiOption: VehicleOption = {
    type: VehicleType.TAXI,
    label: 'Taxi',
    icon: 'local-taxi',
    color: '#F59E0B',
    description: 'Taxi transport',
};

describe('CompanyListHeader', () => {
    it('renders the vehicle label and the company count when not loading', () => {
        const { getByText } = renderWithProviders(
            <CompanyListHeader
                vehicleInfo={taxiOption}
                companiesCount={3}
                loading={false}
                onBackPress={jest.fn()}
            />,
        );

        expect(getByText('Taxi')).toBeTruthy();
        expect(getByText('3 companies-available')).toBeTruthy();
    });

    it('shows the loading label when loading is true', () => {
        const { getByText, queryByText } = renderWithProviders(
            <CompanyListHeader
                vehicleInfo={taxiOption}
                companiesCount={0}
                loading={true}
                onBackPress={jest.fn()}
            />,
        );

        expect(getByText('loading')).toBeTruthy();
        expect(queryByText('0 companies-available')).toBeNull();
    });

    it('calls onBackPress when the back arrow is pressed', () => {
        const onBack = jest.fn();
        const { getByTestId } = renderWithProviders(
            <CompanyListHeader
                vehicleInfo={taxiOption}
                companiesCount={0}
                loading={false}
                onBackPress={onBack}
            />,
        );

        fireEvent.press(getByTestId('icon-arrow-back').parent!);

        expect(onBack).toHaveBeenCalledTimes(1);
    });
});
