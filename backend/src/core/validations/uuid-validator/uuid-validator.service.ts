import { validate as validateUUID } from 'uuid';
import { UUIDValidator } from './uuid-validator.interface';

export class UuidValidatorImpl implements UUIDValidator {
  isValid(uuid: string): boolean {
    return validateUUID(uuid);
  }
}
