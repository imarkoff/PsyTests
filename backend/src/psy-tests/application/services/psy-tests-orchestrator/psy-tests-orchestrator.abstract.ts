import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { UUID } from 'node:crypto';
import { User } from '../../../../users/domain/entities/user.entity';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

export abstract class PsyTestsOrchestrator {
  /**
   * Get all psychological tests.
   * @returns A promise that resolves to an array of PsyTest entities
   */
  abstract getTests(): Promise<PsyTestDto[]>;

  /**
   * Get a psychological test by its ID.
   * @param testId - The UUID of the psychological test to retrieve
   * @param requestedBy - The user requesting the test.
   * @returns
   *  A promise that resolves to a PsyTestWithDetails entity.
   *  Will include additional details based on the requesting user's role.
   * @throws PsyTestNotFoundException if the test is not found
   */
  abstract getTestById(
    testId: UUID,
    requestedBy: User,
  ): Promise<PsyTestWithDetailsDto>;

  /**
   * Get the image associated with a psychological test.
   * @param testId - The UUID of the psychological test
   * @param imagePath - The path to the image file
   * @returns A promise that resolves to a Buffer containing the image data
   * @throws PsyTestImageNotFoundException if the image is not found
   */
  abstract getTestImage(testId: UUID, imagePath: string): Promise<Buffer>;

  /**
   * Get the marks system for a psychological test.
   * @param testId - The UUID of the psychological test
   * @returns A promise that resolves to an object representing the marks system.
   * @throws PsyTestNotFoundException if the marks system or test is not found
   */
  abstract getTestMarksSystem(testId: UUID): Promise<object | [] | null>;
}
