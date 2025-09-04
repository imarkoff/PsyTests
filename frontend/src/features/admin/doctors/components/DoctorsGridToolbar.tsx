import DataGridToolbar from "@/components/DataGridToolbar";
import CreateDoctorDialog from "./CreateDoctorDialog";

export default function DoctorsGridToolbar() {
    return (
        <DataGridToolbar.Root>
            <DataGridToolbar.Title>
                Лікарі, зареєстровані в системі
            </DataGridToolbar.Title>
            <DataGridToolbar.Options>
                <DataGridToolbar.Columns/>
                <DataGridToolbar.Filters/>
                <DataGridToolbar.Export/>
                <DataGridToolbar.Divider/>
                <DataGridToolbar.Search
                    placeholder={"Пошук за П.І.Б. або номером телефону"}
                    sx={{width: {xs: '100%', sm: '300px', md: '400px'}}}
                />
                <DataGridToolbar.Divider/>
                <CreateDoctorDialog/>
            </DataGridToolbar.Options>
        </DataGridToolbar.Root>
    );
}