import {NextResponse} from "next/server";
import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientService from "@/lib/services/DoctorPatientService";

export const PATCH = createApiRoute(
    DoctorPatientService,
    async (service, request, params) => {
        const { patientId } = await params;

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status");

        if (status === null) {
            return NextResponse.json({ error: "Status is not specified" }, { status: 400 });
        }

        return await service.changePatientStatus(patientId, status);
    }
)