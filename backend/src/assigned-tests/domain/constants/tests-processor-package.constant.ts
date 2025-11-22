import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { PsyTestsEngineConfigGetter } from '../../../core/config/configs/psy-tests-engine';

export const TESTS_PROCESSOR_PROTO_PACKAGE = 'psy_tests_processor';
export const TESTS_PROCESSOR_PACKAGE_NAME = 'TESTS_PROCESSOR_PACKAGE';
export const TESTS_PROCESSOR_SERVICE_NAME = 'PsyTestsProcessor';

export const TESTS_PROCESSOR_CLIENTS: ClientsModuleAsyncOptions = [
  {
    name: TESTS_PROCESSOR_PACKAGE_NAME,
    inject: [PsyTestsEngineConfigGetter],
    useFactory: (configGetter: PsyTestsEngineConfigGetter) => {
      const testsEngineConfig = configGetter.get();

      return {
        transport: Transport.GRPC,
        options: {
          package: TESTS_PROCESSOR_PROTO_PACKAGE,
          protoPath: testsEngineConfig.processorProtoPath,
          url: `${testsEngineConfig.host}:${testsEngineConfig.port}`,
        },
      };
    },
  },
];
