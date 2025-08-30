import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import FindPatientContent from './FindPatientContent';
import useFindPatientModal from '@/components/FindPatientDialog/hooks/useFindPatientModal';
import FindInput from '@/components/FindPatientDialog/components/FindInput';
import DoctorPatientsResults from '@/components/FindPatientDialog/components/DoctorPatientsResults';
import OtherPatientsResults from '@/components/FindPatientDialog/components/OtherPatientsResults';
import CreatePatientDialog from '@/features/dashboard/doctor/patients/components/CreatePatientDialog';

jest.mock('@/components/FindPatientDialog/hooks/useFindPatientModal');
jest.mock(
    '@/components/FindPatientDialog/components/FindInput',
    () => jest.fn(() => <div>Find Input</div>)
);
jest.mock(
    '@/components/FindPatientDialog/components/DoctorPatientsResults',
    () => jest.fn(() => <div>Doctor Patients</div>)
);
jest.mock(
    '@/components/FindPatientDialog/components/OtherPatientsResults',
    () => jest.fn(() => <div>Other Patients</div>)
);
jest.mock(
    '@/features/dashboard/doctor/patients/components/CreatePatientDialog',
    () => jest.fn(() => <div>Create Patient Dialog</div>)
);

const mockSearchRef = { current: null };
const mockSetQuery = jest.fn();
const mockHandleClose = jest.fn();

const mockUseFindPatientModal = useFindPatientModal as jest.Mock;
const mockUserFindPatientModalReturnValue = {
    searchRef: mockSearchRef,
    loading: false,
    results: {
        doctorPatients: [],
        otherPatients: [],
        isResultsEmpty: true
    },
    handleClose: mockHandleClose,
    setQuery: mockSetQuery
}

describe('FindPatientContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseFindPatientModal.mockReturnValue(
            mockUserFindPatientModalReturnValue
        );
    });

    it('renders FindInput with correct props', () => {
        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        expect(FindInput).toHaveBeenCalledWith(
            expect.objectContaining({
                searchRef: mockSearchRef,
                setQuery: mockSetQuery,
                loading: false
            }),
            undefined
        );
    });

    it('shows empty results message when no results found and doctorPatients is defined', () => {
        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        expect(screen.getByText('Нічого не знайдено')).toBeInTheDocument();
    });

    it('does not show empty results message when doctorPatients is undefined', () => {
        mockUseFindPatientModal.mockReturnValue({
            ...mockUserFindPatientModalReturnValue,
            results: {
                ...mockUserFindPatientModalReturnValue.results,
                doctorPatients: undefined
            }
        });

        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        expect(screen.queryByText('Нічого не знайдено')).not.toBeInTheDocument();
    });

    it('renders DoctorPatientsResults when doctorPatients has items', () => {
        const mockDoctorPatients = [{ id: '1', name: 'Patient 1' }];
        mockUseFindPatientModal.mockReturnValue({
            ...mockUserFindPatientModalReturnValue,
            results: {
                doctorPatients: mockDoctorPatients,
                otherPatients: [],
                isResultsEmpty: false
            }
        });

        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        expect(DoctorPatientsResults).toHaveBeenCalledWith(
            { patients: mockDoctorPatients },
            undefined
        );
    });

    it('renders OtherPatientsResults when otherPatients has items', () => {
        const mockOtherPatients = [{ id: '2', name: 'Patient 2' }];
        mockUseFindPatientModal.mockReturnValue({
            ...mockUserFindPatientModalReturnValue,
            results: {
                doctorPatients: [],
                otherPatients: mockOtherPatients,
                isResultsEmpty: false
            }
        });

        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        expect(OtherPatientsResults).toHaveBeenCalledWith(
            { patients: mockOtherPatients },
            undefined
        );
    });

    it('displays results header with visible style when doctorPatients is defined', () => {
        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        const resultsHeader = screen.getByText('Результати пошуку');
        expect(resultsHeader).toHaveStyle({ visibility: 'visible' });
    });

    it('displays results header with hidden style when doctorPatients is undefined', () => {
        mockUseFindPatientModal.mockReturnValue({
            ...mockUserFindPatientModalReturnValue,
            results: {
                doctorPatients: undefined,
                otherPatients: [],
                isResultsEmpty: true
            }
        });

        render(<FindPatientContent open={true} onClose={jest.fn()} />);
        const resultsHeader = screen.getByText('Результати пошуку');

        expect(resultsHeader).toHaveStyle({ visibility: 'hidden' });
    });

    it('passes closeAction to CreatePatientDialog', () => {
        render(<FindPatientContent open={true} onClose={jest.fn()} />);

        expect(CreatePatientDialog).toHaveBeenCalledWith(
            expect.objectContaining({
                closeAction: mockHandleClose,
                OpenerAction: expect.anything()
            }),
            undefined
        );
    });
});