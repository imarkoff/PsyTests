import DataGridToolbar from "@/components/DataGridToolbar";
import FindPatientDialog from "@/components/FindPatientDialog";

export default function DoctorPatientsToolbar() {
    return (
        <DataGridToolbar.Root>
            <DataGridToolbar.Title>
                Пацієнти на вашому обліку
            </DataGridToolbar.Title>
            <DataGridToolbar.Options>
                <FindPatientDialog />
            </DataGridToolbar.Options>
        </DataGridToolbar.Root>
    );
}