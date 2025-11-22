import { UserGender } from '../../../shared/enums/user-gender.enum';
import { TestAnswers } from './test-answers.type';
import { TestVerdict } from './test-verdict.type';
import { UUID } from 'node:crypto';

export type ProcessorUser = {
  name: string;
  surname: string;
  patronymic: string | null;
  birth_date: Date; // ISO format YYYY-MM-DD
  gender: UserGender; // "male" or "female"
};

export type ProcessorTestResult = {
  test_result_id: UUID;
  test_id: UUID;
  passed_by: ProcessorUser;
  answers: TestAnswers;
  verdict: TestVerdict;
  passed_at: Date;
};

export type CalculateVerdictRequest = {
  test_id: string;
  user: ProcessorUser;
  answers: TestAnswers;
};

export type CalculateVerdictResponse = {
  verdict: TestVerdict;
};

export type GenerateDocumentRequest = {
  test_result: ProcessorTestResult;
};

export type GenerateDocumentResponse = {
  document_data: Buffer;
  filename: string;
};
