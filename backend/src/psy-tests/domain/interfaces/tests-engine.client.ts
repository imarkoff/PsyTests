import { UUID } from 'node:crypto';
import { PsyTest } from '../entities/psy-test.entity';
import { Observable } from 'rxjs';

type Empty = object;

type GetAllTestsResponse = { tests: PsyTest[] };
type GetTestByIdRequest = { testId: UUID };
type GetTestByIdResponse = { json: string | undefined };

export abstract class TestsEngineClient {
  abstract getAllTests(data: Empty): Observable<GetAllTestsResponse>;
  abstract getTestById(
    data: GetTestByIdRequest,
  ): Observable<GetTestByIdResponse>;
  abstract getTestByIdWithoutAnswers(
    data: GetTestByIdRequest,
  ): Observable<GetTestByIdResponse>;
}
