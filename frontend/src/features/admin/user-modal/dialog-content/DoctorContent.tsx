import {Box} from "@mui/material";
import {UserModalContentProps} from "./types";
import AssignedTestsByDoctorDataGrid from "./components/AssignedTestsByDoctorDataGrid";
import PatientsByDoctorDataGrid from "./components/PatientsByDoctorDataGrid";


export default function DoctorContent(
    {user}: UserModalContentProps
) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <PatientsByDoctorDataGrid doctorId={user.id}/>
            <AssignedTestsByDoctorDataGrid doctorId={user.id}/>
        </Box>
    );
}