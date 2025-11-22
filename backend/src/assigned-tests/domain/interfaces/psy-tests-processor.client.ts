import { Observable } from 'rxjs';
import {
  CalculateVerdictRequest,
  CalculateVerdictResponse,
  GenerateDocumentRequest,
  GenerateDocumentResponse,
} from '../types/psy-tests-processor.client.types';

export abstract class PsyTestsProcessorClient {
  /**
   * Calculates the verdict for a psychological test based on user answers.
   * @param data - The request data containing test ID, user details, and answers.
   * @returns An observable that emits the calculated verdict.
   * @throws ServiceError with NOT_FOUND if the test is not found.
   */
  abstract calculateVerdict(
    data: CalculateVerdictRequest,
  ): Observable<CalculateVerdictResponse>;

  /**
   * Generates a document (e.g., PDF) for the test result.
   * @param data - The request data containing test ID, user details, and test result.
   * @returns An observable that emits the generated document data and filename.
   * @throws ServiceError with NOT_FOUND if the test is not found.
   */
  abstract generateDocument(
    data: GenerateDocumentRequest,
  ): Observable<GenerateDocumentResponse>;
}
