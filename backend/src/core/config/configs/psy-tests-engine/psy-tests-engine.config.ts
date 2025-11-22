import path from 'node:path';
import { PsyTestsEngineConfig } from './psy-tests-engine-config.interface';
import { parseProcessEnv } from '../../utils/parse-process-env.util';
import { parseProcessEnvInt } from '../../utils/parse-process-env-int.util';

export const PSY_TESTS_ENGINE_CONFIG_KEY = 'psyTestsEngine';

export const psyTestsEngineConfig = (): {
  psyTestsEngine: PsyTestsEngineConfig;
} => ({
  [PSY_TESTS_ENGINE_CONFIG_KEY]: <PsyTestsEngineConfig>{
    host: parseProcessEnv('PSY_TESTS_ENGINE_HOST'),
    port: parseProcessEnvInt('PSY_TESTS_ENGINE_PORT'),
    protoPath: path.join(
      process.cwd(),
      parseProcessEnv('PSY_TESTS_ENGINE_PROTO_PATH'),
    ),
    processorProtoPath: path.join(
      process.cwd(),
      parseProcessEnv('PSY_TESTS_PROCESSOR_PROTO_PATH'),
    ),
  },
});
