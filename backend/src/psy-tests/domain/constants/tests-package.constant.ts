import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PsyTestsEngineConfig } from '../../../core/config/psy-tests-engine.config';

export const TESTS_PROTO_PACKAGE = 'psy_tests_engine';
export const TESTS_PACKAGE_NAME = 'TESTS_PACKAGE';
export const TESTS_ENGINE_NAME = 'PsyTestsEngine';

export const TESTS_CLIENTS: ClientsModuleAsyncOptions = [
  {
    name: TESTS_PACKAGE_NAME,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const testsEngineConfig =
        configService.get<PsyTestsEngineConfig>('psyTestsEngine')!;

      return {
        transport: Transport.GRPC,
        options: {
          package: TESTS_PROTO_PACKAGE,
          protoPath: testsEngineConfig.protoPath,
          url: testsEngineConfig.url,
        },
      };
    },
  },
];
