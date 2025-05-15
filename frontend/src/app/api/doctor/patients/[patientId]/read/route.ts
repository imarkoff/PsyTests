import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientService from "@/lib/services/DoctorPatientService";

/** Sets needs_attention for a patient to false */
export const PATCH = createApiRoute(
    DoctorPatientService,
    async (service, _, params) => {
        const { patientId } = await params;
        return await service.readPatient(patientId);
    }
)