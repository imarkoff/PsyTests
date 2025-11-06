import { parseProcessEnv } from './parse-process-env.util';
import { EnvVariableNotANumberError } from '../errors/env-variable-not-a-number.error';

export function parseProcessEnvInt(name: string, fallback?: number): number {
  const raw = parseProcessEnv(name, fallback);

  const val = parseInt(raw, 10);

  if (Number.isNaN(val)) {
    throw new EnvVariableNotANumberError(name);
  }

  return val;
}
