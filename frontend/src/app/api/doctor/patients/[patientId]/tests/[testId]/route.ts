import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const PATCH = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId, testId } = await params;
        return service.assignTest(patientId, testId);
    }
)

// testId is assignedTestId.
// Next.js doesn't allow to use different slug names for the same dynamic path ('assignedTestId' !== 'testId').
export const DELETE = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId, testId } = await params;
        return service.unassignTest(patientId, testId);
    }
)
