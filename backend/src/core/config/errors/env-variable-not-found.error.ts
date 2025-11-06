export class EnvVariableNotFoundError extends Error {
  constructor(variableName: string) {
    super(`Environment variable "${variableName}" not found.`);
    this.name = 'EnvVariableNotFoundError';
  }
}
