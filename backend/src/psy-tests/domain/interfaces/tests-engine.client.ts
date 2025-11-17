import { UUID } from 'node:crypto';
import { Observable } from 'rxjs';

type Empty = object;

type TestMetadata = {
  id: UUID;
  name: string;
  description: string;
  type: string;
};

type GetAllTestsResponse = { tests: TestMetadata[] };

type GetTestByIdRequest = { testId: UUID };
type GetTestByIdResponse = { json: string };
type GetTestMetadataByIdResponse = TestMetadata;

type GetTestImageRequest = { testId: UUID; imagePath: string };
type GetTestImageResponse = { imageData: Buffer };

type GetTestMarksSystemRequest = { testId: UUID };
type GetTestMarksSystemResponse = { marksSystemJson: string };

export abstract class TestsEngineClient {
  abstract getAllTests(data: Empty): Observable<GetAllTestsResponse>;

  /**
   * Get a test by its ID
   * Returns status code NOT_FOUND if the test is not found
   */
  abstract getTestById(
    data: GetTestByIdRequest,
  ): Observable<GetTestByIdResponse>;

  /**
   * Get metadata of a test by its ID
   * Returns status code NOT_FOUND if the test is not found
   */
  abstract getTestMetadataById(
    data: GetTestByIdRequest,
  ): Observable<GetTestMetadataByIdResponse>;

  /**
   * Get a test by its ID without answers
   * Returns status code NOT_FOUND if the test is not found
   */
  abstract getTestByIdWithoutAnswers(
    data: GetTestByIdRequest,
  ): Observable<GetTestByIdResponse>;

  /**
   * Get test image by test ID and image path
   * Returns status code NOT_FOUND if the image is not found
   */
  abstract getTestImage(
    data: GetTestImageRequest,
  ): Observable<GetTestImageResponse>;

  /**
   * Get test marks system by test ID
   * Returns status code NOT_FOUND if the marks system is not found
   */
  abstract getTestMarksSystem(
    data: GetTestMarksSystemRequest,
  ): Observable<GetTestMarksSystemResponse>;
}
