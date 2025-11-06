import { ConfigService } from '@nestjs/config';
import { ConfigNotFoundError } from '../errors/config-not-found.error';
import { Injectable } from '@nestjs/common';

/**
 * Abstract class for retrieving configuration values.
 * Subclasses should define the `configKey` to specify which configuration to retrieve.
 *
 * @example
 * ```typescript
 * export class DatabaseConfigGetter extends ConfigGetter<DatabaseConfig> {
 *   protected readonly configKey = DATABASE_CONFIG_KEY;
 * }
 * ```
 */
@Injectable()
export abstract class ConfigGetter<T> {
  /**
   * The key used to retrieve the configuration value.
   * @protected
   */
  protected readonly configKey: string;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves the configuration value associated with the specified key.
   * Throws a `ConfigNotFoundError` if the configuration is not found.
   *
   * @returns The configuration value of type T.
   */
  get(): T {
    const config = this.configService.get<T>(this.configKey);
    if (!config) throw new ConfigNotFoundError(this.configKey);
    return config;
  }

  /**
   * Retrieves the configuration value associated with the specified key, if it exists.
   * Returns `undefined` if the configuration is not found.
   *
   * @returns The configuration value of type T or `undefined`.
   */
  getOptional(): T | undefined {
    return this.configService.get<T>(this.configKey);
  }
}
