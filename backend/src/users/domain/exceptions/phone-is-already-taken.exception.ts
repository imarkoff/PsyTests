import { ConflictException } from '@nestjs/common';

export class PhoneIsAlreadyTakenException extends ConflictException {
  constructor(phoneNumber: string) {
    super(`The phone number "${phoneNumber}" is already taken.`);
  }
}
