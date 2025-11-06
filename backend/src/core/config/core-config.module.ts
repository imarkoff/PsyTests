import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, AppConfigGetter } from './configs/app';
import { passwordConfig, PasswordConfigGetter } from './configs/password';
import { databaseConfig, DatabaseConfigGetter } from './configs/database';
import {
  psyTestsEngineConfig,
  PsyTestsEngineConfigGetter,
} from './configs/psy-tests-engine';
import { jwtConfig, JwtConfigGetter } from './configs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        passwordConfig,
        psyTestsEngineConfig,
      ],
    }),
  ],
  providers: [
    AppConfigGetter,
    DatabaseConfigGetter,
    JwtConfigGetter,
    PasswordConfigGetter,
    PsyTestsEngineConfigGetter,
  ],
  exports: [
    AppConfigGetter,
    DatabaseConfigGetter,
    JwtConfigGetter,
    PasswordConfigGetter,
    PsyTestsEngineConfigGetter,
  ],
})
export class CoreConfigModule {}
