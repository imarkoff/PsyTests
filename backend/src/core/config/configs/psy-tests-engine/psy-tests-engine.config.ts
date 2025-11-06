import path from 'node:path';
import { PsyTestsEngineConfig } from './psy-tests-engine-config.interface';
import { parseProcessEnv } from '../../utils/parse-process-env.util';

export const PSY_TESTS_ENGINE_CONFIG_KEY = 'psyTestsEngine';

export const psyTestsEngineConfig = (): {
  psyTestsEngine: PsyTestsEngineConfig;
} => ({
  [PSY_TESTS_ENGINE_CONFIG_KEY]: <PsyTestsEngineConfig>{
    url: parseProcessEnv('PSY_TESTS_ENGINE_URL'),
    protoPath: path.join(
      process.cwd(),
      parseProcessEnv('PSY_TESTS_ENGINE_PROTO_PATH'),
    ),
  },
});
