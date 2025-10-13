import DataGridToolbar from "@/components/DataGridToolbar";
import FindPatientDialog from "@/components/FindPatientDialog";

export default function DoctorPatientsToolbar() {
    return (
        <DataGridToolbar.Root>
            <DataGridToolbar.Title>
                Пацієнти на вашому обліку
            </DataGridToolbar.Title>
            <DataGridToolbar.Options>
                <DataGridToolbar.Filters/>
                <DataGridToolbar.Columns/>
                <DataGridToolbar.Divider/>
                <FindPatientDialog />
            </DataGridToolbar.Options>
        </DataGridToolbar.Root>
    );
}