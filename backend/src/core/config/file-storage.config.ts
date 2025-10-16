import path from 'node:path';

export default () => {
  if (!process.env.FILE_DB_BASE_PATH) {
    throw new Error('FILE_DB_BASE_PATH is not specified');
  }

  return {
    fileDbBasePath: path.join(process.cwd(), process.env.FILE_DB_BASE_PATH),
    psyTestsDir: process.env.FILE_DB_PSY_TESTS_DIR,
  };
};
