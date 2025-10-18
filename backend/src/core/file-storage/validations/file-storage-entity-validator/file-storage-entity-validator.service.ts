import { FileStorageEntityValidator } from './file-storage-entity-validator.interface';

export class FileStorageEntityValidatorImpl
  implements FileStorageEntityValidator
{
  private readonly validEntityNameRegex = /^[a-zA-Z0-9_-]+$/;

  isValid(entity: string): boolean {
    return this.validEntityNameRegex.test(entity);
  }
}
