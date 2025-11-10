import { EnvVariableNotFoundError } from '../errors/env-variable-not-found.error';

export function parseProcessEnv(name: string, fallback?: any): string {
  const raw = process.env[name];

  if (raw == null && fallback == null) {
    throw new EnvVariableNotFoundError(name);
  }

  return raw ?? String(fallback);
}
