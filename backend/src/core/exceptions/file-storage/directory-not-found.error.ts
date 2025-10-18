export class DirectoryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectoryNotFoundError';
  }
}
