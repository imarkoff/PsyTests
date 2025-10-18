export abstract class FileStorageEntityValidator {
  /**
   * Validates if the given entity name is valid (e.g., contains only allowed characters).
   * @param entity - The entity name to validate.
   * @returns True if the entity name is valid, false otherwise.
   */
  abstract isValid(entity: string): boolean;
}
