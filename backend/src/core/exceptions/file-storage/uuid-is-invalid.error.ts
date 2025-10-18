export class UUIDIsInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UUIDIsInvalidError';
  }
}
