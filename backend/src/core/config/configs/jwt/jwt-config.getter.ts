import { ConfigGetter } from '../../utils/config-getter.abstract';
import { JwtConfig } from './jwt-config.interface';
import { JWT_CONFIG_KEY } from './jwt.config';

export class JwtConfigGetter extends ConfigGetter<JwtConfig> {
  protected readonly configKey = JWT_CONFIG_KEY;
}
