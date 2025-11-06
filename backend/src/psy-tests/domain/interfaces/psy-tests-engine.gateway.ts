import { PsyTest, PsyTestWithDetails } from '../entities/psy-test.entity';
import { UUID } from 'node:crypto';

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
   * Fetches a psychological test by its ID
   * without answers or other sensitive details.
   * @param id - The ID of the psychological test.
   */
  abstract getTestByIdWithoutAnswers(
    id: UUID,
  ): Promise<PsyTestWithDetails | null>;
}
