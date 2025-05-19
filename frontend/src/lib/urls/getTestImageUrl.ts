const getTestImageUrl = (
    testId: string, imagePath: string
) =>
    `/api/tests/${testId}/image?imagePath=${imagePath}`;

export default getTestImageUrl;