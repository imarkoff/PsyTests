import { IsPhoneNumber } from 'class-validator';

export class UserByPhoneDto {
  @IsPhoneNumber(undefined, {
    message: 'phoneNumber must be a valid phone number (E.164 format)',
  })
  phoneNumber: string;
}
