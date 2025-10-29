import { IsPhoneNumber } from 'class-validator';
import { IsPasswordValid } from '../../../core/decorators/is-password-valid.decorator';

export class UserLoginDto {
  @IsPhoneNumber(undefined, {
    message: 'The phone number must be valid (E.164 format).',
  })
  phoneNumber: string;

  @IsPasswordValid()
  password: string;
}
