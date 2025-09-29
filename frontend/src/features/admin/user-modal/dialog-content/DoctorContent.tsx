import {UserModalContentProps} from "./types";
import AssignedTestsByDoctorDataGrid from "./components/AssignedTestsByDoctorDataGrid";


export default function DoctorContent(
    {user}: UserModalContentProps
) {
    return (
        <>
            <AssignedTestsByDoctorDataGrid doctorId={user.id}/>
        </>
    );
}