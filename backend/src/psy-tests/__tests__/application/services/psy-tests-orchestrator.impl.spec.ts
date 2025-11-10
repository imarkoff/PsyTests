/* eslint-disable @typescript-eslint/unbound-method */
import { PsyTestsOrchestratorImpl } from '../../../application/services/psy-tests-orchestrator/psy-tests-orchestrator.impl';
import { QueryBus } from '@nestjs/cqrs';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { Test } from '@nestjs/testing';
import { GetPsyTestsQuery } from '../../../application/queries/get-psy-tests/get-psy-tests.query';
import { randomUUID } from 'node:crypto';
import { GetPsyTestByIdQuery } from '../../../application/queries/get-psy-test-by-id/get-psy-test-by-id.query';
import { createPsyTestDtoFixture } from '../../fixtures/psy-test-dto.fixture';
import { GetPsyTestByIdWithoutAnswersQuery } from '../../../application/queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.query';
import { User } from '../../../../users/domain/entities/user.entity';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { PsyTestNotFoundException } from '../../../domain/exceptions/psy-test-not-found.exception';
import { GetPsyTestImageQuery } from '../../../application/queries/get-psy-test-image/get-psy-test-image.query';
import { PsyTestImageNotFoundException } from '../../../domain/exceptions/psy-test-image-not-found.exception';
import { GetPsyTestMarksSystemQuery } from '../../../application/queries/get-psy-test-marks-system/get-psy-test-marks-system.query';

describe(PsyTestsOrchestratorImpl.name, () => {
  let psyTestsOrchestrator: PsyTestsOrchestratorImpl;
  let queryBus: jest.Mocked<QueryBus>;
  let roleValidator: jest.Mocked<RoleValidator>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PsyTestsOrchestratorImpl,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RoleValidator,
          useValue: {
            isDoctorOrAdmin: jest
              .fn()
              .mockImplementation(
                (role: UserRole) =>
                  role === UserRole.DOCTOR || role === UserRole.ADMIN,
              ),
          },
        },
      ],
    }).compile();

    psyTestsOrchestrator = module.get(PsyTestsOrchestratorImpl);
    queryBus = module.get(QueryBus);
    roleValidator = module.get(RoleValidator);
  });

  describe('getTests', () => {
    it('should call queryBus.execute with GetPsyTestsQuery', async () => {
      await psyTestsOrchestrator.getTests();

      const dispatchedQuery = queryBus.execute.mock.calls[0][0];
      expect(dispatchedQuery).toBeInstanceOf(GetPsyTestsQuery);
    });
  });

  describe('getTestById', () => {
    it.each([UserRole.DOCTOR, UserRole.ADMIN])(
      'should fetch test with full details for %s role',
      async (role) => {
        const mockTest = createPsyTestDtoFixture();
        const user = User.fromPersistence(
          createUserPersistence({ role: role }),
        );
        queryBus.execute.mockResolvedValueOnce(mockTest);

        await psyTestsOrchestrator.getTestById(mockTest.id, user);

        const dispatchedQuery = queryBus.execute.mock
          .calls[0][0] as GetPsyTestByIdQuery;
        expect(roleValidator.isDoctorOrAdmin).toHaveBeenCalledWith(role);
        expect(dispatchedQuery).toBeInstanceOf(GetPsyTestByIdQuery);
        expect(dispatchedQuery.testId).toBe(mockTest.id);
      },
    );

    it(`should fetch test without answers for ${UserRole.PATIENT} role`, async () => {
      const mockTest = createPsyTestDtoFixture();
      const user = User.fromPersistence(
        createUserPersistence({ role: UserRole.PATIENT }),
      );
      queryBus.execute.mockResolvedValueOnce(mockTest);

      await psyTestsOrchestrator.getTestById(mockTest.id, user);

      const dispatchedQuery = queryBus.execute.mock
        .calls[0][0] as GetPsyTestByIdWithoutAnswersQuery;
      expect(roleValidator.isDoctorOrAdmin).toHaveBeenCalledWith(
        UserRole.PATIENT,
      );
      expect(dispatchedQuery).toBeInstanceOf(GetPsyTestByIdWithoutAnswersQuery);
      expect(dispatchedQuery.testId).toBe(mockTest.id);
    });

    it('should throw PsyTestNotFoundException if test does not exist', async () => {
      const nonExistentTestId = randomUUID();
      const user = User.fromPersistence(
        createUserPersistence({ role: UserRole.PATIENT }),
      );
      queryBus.execute.mockResolvedValueOnce(null);

      await expect(
        psyTestsOrchestrator.getTestById(nonExistentTestId, user),
      ).rejects.toThrow(PsyTestNotFoundException);
    });
  });

  describe('getTestImage', () => {
    it('should call queryBus.execute with GetPsyTestImageQuery', async () => {
      const testId = randomUUID();
      const imagePath = 'path/to/image.png';
      const mockBuffer = Buffer.from('image data');
      queryBus.execute.mockResolvedValueOnce(mockBuffer);

      const result = await psyTestsOrchestrator.getTestImage(testId, imagePath);

      const dispatchedQuery = queryBus.execute.mock
        .calls[0][0] as GetPsyTestImageQuery;
      expect(dispatchedQuery).toBeInstanceOf(GetPsyTestImageQuery);
      expect(dispatchedQuery.testId).toBe(testId);
      expect(dispatchedQuery.imagePath).toBe(imagePath);
      expect(result).toBe(mockBuffer);
    });

    it('should throw PsyTestImageNotFoundException if image does not exist', async () => {
      const testId = randomUUID();
      const imagePath = 'path/to/nonexistent-image.png';
      queryBus.execute.mockResolvedValueOnce(null);

      await expect(
        psyTestsOrchestrator.getTestImage(testId, imagePath),
      ).rejects.toThrow(PsyTestImageNotFoundException);
    });
  });

  describe('getTestMarksSystem', () => {
    it('should call queryBus.execute with GetPsyTestMarksSystem', async () => {
      const testId = randomUUID();
      const mockMarksSystem = { some: 'marks system data' };
      queryBus.execute.mockResolvedValueOnce(mockMarksSystem);

      const result: unknown =
        await psyTestsOrchestrator.getTestMarksSystem(testId);

      const dispatchedQuery = queryBus.execute.mock
        .calls[0][0] as GetPsyTestMarksSystemQuery;
      expect(dispatchedQuery).toBeInstanceOf(GetPsyTestMarksSystemQuery);
      expect(dispatchedQuery.testId).toBe(testId);
      expect(result).toBe(mockMarksSystem);
    });

    it('should throw PsyTestNotFoundException if marks system does not exist', async () => {
      const testId = randomUUID();
      queryBus.execute.mockResolvedValueOnce(null);

      await expect(
        psyTestsOrchestrator.getTestMarksSystem(testId),
      ).rejects.toThrow(PsyTestNotFoundException);
    });
  });
});
