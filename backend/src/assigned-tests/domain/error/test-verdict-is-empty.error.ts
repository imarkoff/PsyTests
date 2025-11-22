export class TestVerdictIsEmptyError extends Error {
  constructor(testResultId: string) {
    super('Test verdict is empty for test result with ID: ' + testResultId);
    this.name = 'TestVerdictIsEmptyError';
  }
}
