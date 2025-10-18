export class FileNoAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileNoAccessError';
  }
}
