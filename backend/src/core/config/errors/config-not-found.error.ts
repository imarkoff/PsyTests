export class ConfigNotFoundError extends Error {
  constructor(configKey: string) {
    super(`Configuration for key "${configKey}" not found.`);
    this.name = 'ConfigNotFoundError';
  }
}
