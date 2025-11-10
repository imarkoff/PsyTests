import { PasswordConfig } from './password-config.interface';

export const PASSWORD_CONFIG_KEY = 'password';

export const passwordConfig = (): { password: PasswordConfig } => ({
  [PASSWORD_CONFIG_KEY]: {
    minLength: 6,
    maxLength: 64,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  },
});
