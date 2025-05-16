import {NextResponse} from "next/server";
import DoctorPatientService from "@/lib/services/DoctorPatientService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    DoctorPatientService,
    async (service, request) => {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search");

        if (!search) {
            return NextResponse.json({ error: "Search param is required" }, { status: 400 });
        }

        return await service.findPatient(search);
    }
)