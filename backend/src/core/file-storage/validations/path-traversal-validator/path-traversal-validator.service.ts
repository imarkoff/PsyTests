import { PathTraversalValidator } from './path-traversal-validator.interface';
import path from 'node:path';

export class PathTraversalValidatorImpl implements PathTraversalValidator {
  isValid(basePath: string, fullPath: string): boolean {
    const normalizedBasePath = path.normalize(path.join(basePath, path.sep));
    const normalizedFullPath = path.normalize(fullPath);
    return normalizedFullPath.startsWith(normalizedBasePath);
  }
}
