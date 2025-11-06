import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { PsyTestsEngineConfigGetter } from '../../../core/config/configs/psy-tests-engine';

export const TESTS_PROTO_PACKAGE = 'psy_tests_engine';
export const TESTS_PACKAGE_NAME = 'TESTS_PACKAGE';
export const TESTS_ENGINE_NAME = 'PsyTestsEngine';

export const TESTS_CLIENTS: ClientsModuleAsyncOptions = [
  {
    name: TESTS_PACKAGE_NAME,
    inject: [PsyTestsEngineConfigGetter],
    useFactory: (configGetter: PsyTestsEngineConfigGetter) => {
      const testsEngineConfig = configGetter.get();

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
