import { UUID } from 'node:crypto';
import { PsyTest } from '../entities/psy-test.entity';
import { PsyTestWithDetails } from '../entities/psy-test-with-details.entity';

/**
 * Gateway for interacting with the test engine.
 * Provides methods to fetch psychological tests.
 */
export abstract class PsyTestsEngineGateway {
  /**
   * Fetches all psychological tests.
   * @returns A promise that resolves to an array of PsyTest entities.
   */
  abstract getAllTests(): Promise<PsyTest[]>;

  /**
   * Fetches a psychological test by its ID.
   * @param id - The ID of the psychological test.
   * @returns A promise that resolves to a PsyTestWithDetails entity or null if not found.
   */
  abstract getTestById(id: UUID): Promise<PsyTestWithDetails | null>;

  /**
   * Fetches metadata of a psychological test by its ID.
   * @param id - The ID of the psychological test.
   * @returns A promise that resolves to a PsyTest entity or null if not found.
   */
  abstract getTestMetadataById(id: UUID): Promise<PsyTest | null>;

  /**
   * Fetches a psychological test by its ID
   * without answers or other sensitive details.
   * @param id - The ID of the psychological test.
   */
  abstract getTestByIdWithoutAnswers(
    id: UUID,
  ): Promise<PsyTestWithDetails | null>;

  /**
   * Fetches the image associated with a psychological test by its ID.
   * @param id - The ID of the psychological test.
   * @param imagePath - The path to the image within the test resources.
   * @returns A promise that resolves to a Buffer containing the image data or null if not found.
   */
  abstract getTestImage(id: UUID, imagePath: string): Promise<Buffer | null>;

  /**
   * Fetches the marks system for a psychological test by its ID.
   * @param id - The ID of the psychological test.
   * @returns A promise that resolves to an object, array, or null representing the marks system.
   */
  abstract getTestMarksSystem(id: UUID): Promise<object | [] | null>;
}
