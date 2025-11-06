import { ConfigGetter } from '../../utils/config-getter.abstract';
import { AppConfig } from './app-config.interface';
import { APP_CONFIG_KEY } from './app.config';

export class AppConfigGetter extends ConfigGetter<AppConfig> {
  protected readonly configKey = APP_CONFIG_KEY;
}
