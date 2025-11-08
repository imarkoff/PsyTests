import { UUID } from 'node:crypto';
import { PsyTestDto } from '../../presentation/dtos/psy-test.dto';
import { Observable } from 'rxjs';

type Empty = object;

type GetAllTestsResponse = { tests: PsyTestDto[] };

type GetTestByIdRequest = { testId: UUID };
type GetTestByIdResponse = { json: string | undefined };

type GetTestImageRequest = { testId: UUID; imagePath: string };
type GetTestImageResponse = { imageData: Buffer | undefined };

type GetTestMarksSystemRequest = { testId: UUID };
type GetTestMarksSystemResponse = { marksSystemJson: string | undefined };

export abstract class TestsEngineClient {
  abstract getAllTests(data: Empty): Observable<GetAllTestsResponse>;
  abstract getTestById(
    data: GetTestByIdRequest,
  ): Observable<GetTestByIdResponse>;
  abstract getTestByIdWithoutAnswers(
    data: GetTestByIdRequest,
  ): Observable<GetTestByIdResponse>;
  abstract getTestImage(
    data: GetTestImageRequest,
  ): Observable<GetTestImageResponse>;
  abstract getTestMarksSystem(
    data: GetTestMarksSystemRequest,
  ): Observable<GetTestMarksSystemResponse>;
}
