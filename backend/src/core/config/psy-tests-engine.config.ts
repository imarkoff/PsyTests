import path from 'node:path';

export interface PsyTestsEngineConfig {
  url: string;
  protoPath: string;
}

export default (): { psyTestsEngine: PsyTestsEngineConfig } => {
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
    psyTestsEngine: {
      url: process.env.PSY_TESTS_ENGINE_URL,
      protoPath: protoPath,
    },
  };
};
