"use client";

import DoctorPatientsDataGrid from "./components/DoctorPatientsDataGrid";
import useGetPatientsApi from "./hooks/lib/useGetPatientsApi";
import {useRouter} from "next/navigation";
import DoctorPatient from "@/types/models/DoctorPatient";
import routeConfig from "@/config/routeConfig";

export default function DoctorPatientsPage() {
    const router = useRouter();

    const {
        paginatedPatients,
        isLoading,
        error,
        paginationHandlers: {
            paginationModel, setPaginationModel,
            sortModel, setSortModel,
            filterModel, setFilterModel
        }
    } = useGetPatientsApi();

    const handlePatientClick = (doctorPatient: DoctorPatient) => {
        router.push(routeConfig.dashboard.doctor.patients.patientId.route(doctorPatient.patient.id));
    };

    return (
        <DoctorPatientsDataGrid
            paginatedPatients={paginatedPatients}
            loading={isLoading}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            onPatientClick={handlePatientClick}
            error={error}
        />
    );
}