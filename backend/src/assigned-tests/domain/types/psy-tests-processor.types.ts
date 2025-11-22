import { User } from '../../../users/domain/entities/user.entity';
import { TestAnswers } from './test-answers.type';
import { TestResult } from '../entities/test-result.entity';

export type GeneratedDocument = {
  documentData: Buffer;
  filename: string;
};

export type TestVerdict = Record<string, any>;

export type CalculateVerdictParams = {
  testId: string;
  user: User;
  answers: TestAnswers;
};

export type GenerateDocumentParams = {
  testId: string;
  user: User;
  testResult: TestResult;
};
