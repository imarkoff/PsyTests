import TestBase from "@/types/models/TestBase";
import AssignHeader from "./components/AssignHeader";
import AssignContent from "./components/AssignContent";
import AssignActions from "./components/AssignActions";
import DoctorPatientsProvider from "./stores/DoctorPatientsProvider";
import TestAssignmentProvider from "./stores/TestAssignmentProvider";
import AssignDialog from "./components/AssignDialog";

interface AssignTestDialogProps {
    test: TestBase;
    open: boolean;
    setOpenAction: (open: boolean) => void;
}

/**
 * Dialog component that allows doctors to assign a medical test to a patient.
 * Displays a list of available patients and handles the assignment process.
 *
 * @param test - the test to be assigned to a patient
 * @param open - Controls dialog visibility state
 * @param setOpenAction - Function to update dialog open/close state
 */
export default function AssignTestDialog({test, open, setOpenAction}: AssignTestDialogProps) {
    return (
        <DoctorPatientsProvider>
            <TestAssignmentProvider testId={test.id} setOpenAction={setOpenAction}>
                <AssignDialog open={open}>
                    <AssignHeader test={test}/>
                    <AssignContent />
                    <AssignActions />
                </AssignDialog>
            </TestAssignmentProvider>
        </DoctorPatientsProvider>
    );
}