export abstract class UUIDValidator {
  /**
   * Validates whether the provided string is a valid UUID.
   * @param uuid - The string to validate.
   * @returns True if the string is a valid UUID, false otherwise.
   */
  abstract isValid(uuid: string): boolean;
}
