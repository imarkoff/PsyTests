export class PatientNotSpecifiedError extends Error {
  constructor() {
    super('Patient information is not specified for test result');
    this.name = 'PatientNotSpecifiedError';
  }
}
