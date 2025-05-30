import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import OtherPatientsResults from '@/components/FindPatientDialog/components/OtherPatientsResults';
import OtherPatientCard from '@/components/PatientCard/OtherPatientCard';
import User from "@/schemas/User";

jest.mock(
    '@/components/PatientCard/OtherPatientCard',
    () => jest.fn(() => <div data-testid="other-patient-card" />)
);

describe('OtherPatientsResults', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders header text correctly', () => {
        const patients = [{ id: '1', name: 'John Doe' }] as User[];
        render(<OtherPatientsResults patients={patients} />);

        expect(screen.getByText('Інші пацієнти')).toBeInTheDocument();
    });

    it('renders correct number of patient cards', () => {
        const patients = [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Bob Johnson' }
        ] as User[];

        render(<OtherPatientsResults patients={patients} />);

        expect(OtherPatientCard).toHaveBeenCalledTimes(3);
        expect(screen.getAllByTestId('other-patient-card')).toHaveLength(3);
    });

    it('passes correct patient data to each card', () => {
        const patients = [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' }
        ] as User[];

        render(<OtherPatientsResults patients={patients} />);

        expect(OtherPatientCard).toHaveBeenNthCalledWith(1, { patient: patients[0] }, undefined);
        expect(OtherPatientCard).toHaveBeenNthCalledWith(2, { patient: patients[1] }, undefined);
    });

    it('renders only header when patients array is empty', () => {
        render(<OtherPatientsResults patients={[]} />);

        expect(screen.getByText('Інші пацієнти')).toBeInTheDocument();
        expect(OtherPatientCard).not.toHaveBeenCalled();
        expect(screen.queryAllByTestId('other-patient-card')).toHaveLength(0);
    });
});