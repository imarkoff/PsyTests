import { EnvVariableNotFoundError } from '../errors/env-variable-not-found.error';

export function parseEnvInt(name: string, fallback?: number): number {
  const raw = process.env[name];
  if (raw == null) {
    if (fallback == null) throw new EnvVariableNotFoundError(name);
    return fallback;
  }
  const val = parseInt(raw, 10);
  if (Number.isNaN(val)) throw new Error(`${name} is not a valid integer`);
  return val;
}
