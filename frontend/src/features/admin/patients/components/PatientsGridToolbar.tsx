import DataGridToolbar from "@/components/DataGridToolbar";
import CreatePatientDialog from "./CreatePatientDialog";

export default function PatientsGridToolbar() {
    return (
        <DataGridToolbar.Root>
            <DataGridToolbar.Title>
                Пацієнти, зареєстровані в системі
            </DataGridToolbar.Title>
            <DataGridToolbar.Options>
                <DataGridToolbar.Columns/>
                <DataGridToolbar.Filters/>
                <DataGridToolbar.Divider/>
                <DataGridToolbar.Search
                    placeholder={"Пошук за П.І.Б. або номером телефону"}
                    sx={{width: {xs: '100%', sm: '300px', md: '400px'}}}
                />
                <DataGridToolbar.Divider/>
                <CreatePatientDialog/>
            </DataGridToolbar.Options>
        </DataGridToolbar.Root>
    );
}