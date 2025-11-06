import { ConfigGetter } from '../../utils/config-getter.abstract';
import { DatabaseConfig } from './database-config.interface';
import { DATABASE_CONFIG_KEY } from './database.config';

export class DatabaseConfigGetter extends ConfigGetter<DatabaseConfig> {
  protected readonly configKey = DATABASE_CONFIG_KEY;
}
