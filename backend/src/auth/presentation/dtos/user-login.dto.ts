import { IsPhoneNumber } from 'class-validator';
import { IsPasswordValid } from '../../../core/decorators/is-password-valid.decorator';
import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'Data Transfer Object for user login.' })
export class UserLoginDto {
  /**
   * The user's phone number in E.164 format.
   * @example +1234567890
   */
  @IsPhoneNumber(undefined, {
    message: 'The phone number must be valid (E.164 format).',
  })
  phoneNumber: string;

  /**
   * The user's password. Should meet the defined security criteria.
   * @example StrongP@ssw0rd!
   * */
  @IsPasswordValid()
  password: string;
}
