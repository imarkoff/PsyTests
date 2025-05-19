import {NextRequest, NextResponse} from "next/server";
import {getTestImage} from "@/lib/controllers/testController";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ testId: string }> }
) {
    const { testId } = await params;

    const { searchParams } = request.nextUrl;
    const imagePath = searchParams.get("imagePath");

    if (!imagePath) {
        return new NextResponse("Image path is required", { status: 400 });
    }

    const {data: axiosResponse, error} = await getTestImage(testId, imagePath);

    if (error) {
        return new NextResponse(error.statusText, { status: error.status });
    }

    const contentType = axiosResponse?.headers["content-type"];

    return new NextResponse(axiosResponse?.data, {
        headers: {
            "Content-Type": contentType ?? "image/jpeg",
            "Cache-Control": "public, max-age=86400", // 24 hours
        }
    })
}