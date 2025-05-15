import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";
import {NextResponse} from "next/server";

export const GET = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId, testId } = await params;
        const {
            data, contentDisposition, contentType
        } = await service.exportTestResult(patientId, testId);

        return new NextResponse(data, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': contentDisposition
            }
        })
    }
)