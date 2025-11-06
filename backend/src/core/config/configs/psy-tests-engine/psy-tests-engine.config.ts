import path from 'node:path';
import { PsyTestsEngineConfig } from './psy-tests-engine-config.interface';

export const PSY_TESTS_ENGINE_CONFIG_KEY = 'psyTestsEngine';

export const psyTestsEngineConfig = (): {
  psyTestsEngine: PsyTestsEngineConfig;
} => {
  if (!process.env.PSY_TESTS_ENGINE_URL) {
    throw new Error('PSY_TESTS_ENGINE_URL is not specified');
  }
  if (!process.env.PSY_TESTS_ENGINE_PROTO_PATH) {
    throw new Error('PSY_TESTS_ENGINE_PROTO_PATH is not specified');
  }

  const protoPath = path.join(
    process.cwd(),
    process.env.PSY_TESTS_ENGINE_PROTO_PATH,
  );

  return {
    [PSY_TESTS_ENGINE_CONFIG_KEY]: {
      url: process.env.PSY_TESTS_ENGINE_URL,
      protoPath: protoPath,
    },
  };
};
