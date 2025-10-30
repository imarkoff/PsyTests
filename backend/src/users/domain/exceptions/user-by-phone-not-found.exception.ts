import { NotFoundException } from '@nestjs/common';

export class UserByPhoneNotFoundException extends NotFoundException {
  constructor(phoneNumber: string) {
    super(`User with phone number ${phoneNumber} not found.`);
  }
}
