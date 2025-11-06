import {
  PsyTest,
  PsyTestWithDetails,
} from '../../../domain/entities/psy-test.entity';
import { UUID } from 'node:crypto';
import { User } from '../../../../users/domain/entities/user.entity';

export abstract class PsyTestsOrchestrator {
  /**
   * Get all psychological tests.
   * @returns A promise that resolves to an array of PsyTest entities
   */
  abstract getTests(): Promise<PsyTest[]>;

  /**
   * Get a psychological test by its ID.
   * @param testId - The UUID of the psychological test to retrieve
   * @param requestedBy - The user requesting the test.
   * @returns A promise that resolves to
   *  a PsyTest if the user is a patient
   *  or PsyTestWithDetails if the user is admin or doctor,
   *  or null if not found
   */
  abstract getTestById(
    testId: UUID,
    requestedBy: User | null,
  ): Promise<PsyTest | PsyTestWithDetails | null>;
}
