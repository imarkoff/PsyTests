import {NextRequest, NextResponse} from "next/server";
import {defaultApi} from "@/lib/api-client/createApiInstance";
import {AxiosError} from "axios";
import TestService from "@/lib/services/TestService";

/**
 * Gets the image of a test
 * GET /api/tests/[testId]/image?imagePath=...
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ testId: string }> }
) {
    const { testId } = await params;

    const searchParams = request.nextUrl.searchParams;
    const imagePath = searchParams.get("imagePath");

    if (!imagePath) {
        return NextResponse.json({ error: "Image path is required" }, { status: 400 });
    }

    try {
        const testService = new TestService(defaultApi);
        const response = await testService.testImage(testId, imagePath);

        const contentType = response.headers['content-type'] || 'image/jpeg';

        return new NextResponse(response.data, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400' // 24 hours
            }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        throw error;
    }
}