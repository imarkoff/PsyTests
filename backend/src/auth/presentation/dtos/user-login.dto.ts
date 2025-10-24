import { IsPhoneNumber } from 'class-validator';

export class UserLoginDto {
  @IsPhoneNumber(undefined, {
    message: 'The phone number must be valid (E.164 format).',
  })
  phoneNumber: string;
  password: string;
}
