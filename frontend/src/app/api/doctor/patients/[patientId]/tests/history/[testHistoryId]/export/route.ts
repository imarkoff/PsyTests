import {exportTestResult} from "@/lib/controllers/doctorPatientTestController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {NextRequest, NextResponse} from "next/server";
import SafeError from "@/lib/api-client/SafeError";

export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ patientId: string; testHistoryId: string }> }
) => {
    const { patientId, testHistoryId } = await params;

    try {
        const response = await withSafeErrorHandling(exportTestResult)(patientId, testHistoryId);

        if (!response) {
            return NextResponse.json({ error: "Failed to export test result" }, { status: 500 });
        }

        const { data, contentDisposition, contentType } = response;

        return new NextResponse(data, {
            headers: {
                "Content-Disposition": contentDisposition,
                "Content-Type": contentType,
                "Cache-Control": "no-store"
            }
        })
    }
    catch (error) {
        if (error instanceof SafeError) {
            return NextResponse.json({ originalError: error.toJSON() }, { status: error.status, statusText: error.message });
        }
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}