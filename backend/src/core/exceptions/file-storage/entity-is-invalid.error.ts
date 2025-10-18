export class EntityIsInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EntityIsInvalidError';
  }
}
