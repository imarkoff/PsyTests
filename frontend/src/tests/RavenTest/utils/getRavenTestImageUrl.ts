import getTestImageUrl from "@/lib/utils/getTestImageUrl";

const getRavenTestImageUrl = (
    testId: string, imageModule: string | undefined, imagePath: string
) =>
    getTestImageUrl(testId, `${imageModule ?? ""}/${imagePath}`);

export default getRavenTestImageUrl;