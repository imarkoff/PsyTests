import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FindPatientDialog from './FindPatientDialog';

jest.mock('./components/FindModalOpener', () => ({
    __esModule: true,
    default: ({ handleOpen }: { handleOpen: () => void }) => (
        <button data-testid="opener" onClick={handleOpen}>Find Patient</button>
    ),
}));

jest.mock('./components/FindPatientContent', () => ({
    __esModule: true,
    default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
        <div data-testid="content" style={{ display: open ? 'block' : 'none' }}>
            <button data-testid="close" onClick={onClose}>Close</button>
        </div>
    ),
}));

describe('FindPatientDialog', () => {
    it('renderInitiallyWithClosedModal', () => {
        render(<FindPatientDialog />);
        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('openModalWhenOpenerButtonIsClicked', () => {
        render(<FindPatientDialog />);

        fireEvent.click(screen.getByTestId('opener'));

        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('closeModalWhenCloseButtonIsClicked', () => {
        render(<FindPatientDialog />);

        fireEvent.click(screen.getByTestId('opener'));
        fireEvent.click(screen.getByTestId('close'));

        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closeModalWhenClickingOutside', () => {
        render(<FindPatientDialog />);

        fireEvent.click(screen.getByTestId('opener'));
        // Simulate clicking the Modal backdrop
        const backdrop = screen.getByRole('presentation').firstChild;
        if (backdrop) fireEvent.click(backdrop);
        else throw new Error('Backdrop not found');

        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });
});