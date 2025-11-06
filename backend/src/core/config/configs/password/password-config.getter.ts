import { ConfigGetter } from '../../utils/config-getter.abstract';
import { PASSWORD_CONFIG_KEY } from './password.config';
import { PasswordConfig } from './password-config.interface';

export class PasswordConfigGetter extends ConfigGetter<PasswordConfig> {
  protected readonly configKey = PASSWORD_CONFIG_KEY;
}
