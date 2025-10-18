export abstract class PathTraversalValidator {
  /**
   * Validates if the provided file path is safe and does not contain path traversal sequences.
   * @param basePath - The base directory path. Should be the root from which file access is allowed.
   * @param fullPath - The full file path to validate. Should be the complete path including the base path.
   * @returns True if the path is valid, false otherwise.
   */
  abstract isValid(basePath: string, fullPath: string): boolean;
}
