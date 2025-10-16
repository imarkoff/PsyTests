export abstract class FileStorageService {
  /**
   * Fetches an entity by its ID.
   * @param entity - The name of the entity type.
   * @param id - The UUID of the entity.
   * @returns A promise that resolves to the entity data or null if not found.
   * @throws Error if the entity name is invalid.
   * @throws TypeError if the provided ID is not a valid UUID.
   */
  abstract getById<T>(entity: string, id: string): Promise<T | null>;

  /**
   * Fetches all entities of a given type.
   * @param entity - The name of the entity type.
   * @returns A promise that resolves to an array of entities.
   * @throws Error if the specified entity does not exist.
   */
  abstract getAll<T>(entity: string): Promise<T[]>;

  /**
   * Fetches a specific file associated with an entity.
   * @param entity - The name of the entity type.
   * @param id - The UUID of the entity.
   * @param filePath - The relative path to the file within the entity's directory.
   * @returns A promise that resolves to a Buffer containing the file data or null if not found.
   * @throws Error if the entity name is invalid.
   * @throws TypeError if the provided ID is not a valid UUID.
   */
  abstract getEntityFile(
    entity: string,
    id: string,
    filePath: string,
  ): Promise<Buffer | null>;
}
