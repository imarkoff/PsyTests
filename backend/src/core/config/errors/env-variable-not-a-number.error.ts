export class EnvVariableNotANumberError extends Error {
  constructor(variableName: string) {
    super(`Environment variable "${variableName}" is not a valid number.`);
    this.name = 'EnvVariableNotANumberError';
  }
}
