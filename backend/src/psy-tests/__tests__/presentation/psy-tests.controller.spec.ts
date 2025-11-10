/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID, UUID } from 'node:crypto';
import { Response } from 'express';
import { lookup as mimeLookup } from 'mime-types';
import { PsyTestsController } from '../../presentation/psy-tests.controller';
import { PsyTestsOrchestrator } from '../../application/services/psy-tests-orchestrator/psy-tests-orchestrator.abstract';
import { createPsyTestDtoFixture } from '../fixtures/psy-test-dto.fixture';
import { createUserPersistence } from '../../../__tests__/fixtures/user.fixture';
import { User } from '../../../users/domain/entities/user.entity';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { PsyTestNotFoundException } from '../../domain/exceptions/psy-test-not-found.exception';
import { PsyTestImageNotFoundException } from '../../domain/exceptions/psy-test-image-not-found.exception';
jest.mock('mime-types', () => ({
  lookup: jest.fn(),
}));

describe('PsyTestsController', () => {
  let controller: PsyTestsController;
  let orchestrator: jest.Mocked<PsyTestsOrchestrator>;

  const mockOrchestrator = {
    getTests: jest.fn(),
    getTestById: jest.fn(),
    getTestImage: jest.fn(),
    getTestMarksSystem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsyTestsController],
      providers: [
        {
          provide: PsyTestsOrchestrator,
          useValue: mockOrchestrator,
        },
      ],
    }).compile();

    controller = module.get<PsyTestsController>(PsyTestsController);
    orchestrator = module.get(PsyTestsOrchestrator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTests', () => {
    it('should call orchestrator and return a list of tests', async () => {
      const tests = [createPsyTestDtoFixture()];
      orchestrator.getTests.mockResolvedValue(tests);

      const result = await controller.getTests();

      expect(orchestrator.getTests).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tests);
    });
  });

  describe('getTestById', () => {
    it('should call orchestrator with correct params and return a test', async () => {
      const testId: UUID = randomUUID();
      const user = User.fromPersistence(
        createUserPersistence({ role: UserRole.PATIENT }),
      );
      const test = createPsyTestDtoFixture();
      orchestrator.getTestById.mockResolvedValue(test);

      const result = await controller.getTestById(testId, user);

      expect(orchestrator.getTestById).toHaveBeenCalledWith(testId, user);
      expect(result).toEqual(test);
    });

    it('should propagate error from orchestrator', async () => {
      const testId: UUID = randomUUID();
      const user = User.fromPersistence(
        createUserPersistence({ role: UserRole.PATIENT }),
      );
      const error = new PsyTestNotFoundException(testId);
      orchestrator.getTestById.mockRejectedValue(error);

      await expect(controller.getTestById(testId, user)).rejects.toThrow(
        PsyTestNotFoundException,
      );
    });
  });

  describe('getTestImage', () => {
    it('should get image buffer and send it in response with correct headers', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'image.png';
      const buffer = Buffer.from('image-data');
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      (mimeLookup as jest.Mock).mockReturnValue('image/png');
      orchestrator.getTestImage.mockResolvedValue(buffer);

      await controller.getTestImage(testId, imagePath, mockResponse);

      expect(orchestrator.getTestImage).toHaveBeenCalledWith(testId, imagePath);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/png',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Length',
        buffer.length.toString(),
      );
      expect(mockResponse.send).toHaveBeenCalledWith(buffer);
    });

    it('should use default content type if mime type is not found', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'image.unknown';
      const buffer = Buffer.from('image-data');
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      (mimeLookup as jest.Mock).mockReturnValue(false);
      orchestrator.getTestImage.mockResolvedValue(buffer);

      await controller.getTestImage(testId, imagePath, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
    });

    it('should propagate error from orchestrator', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'image.png';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      const error = new PsyTestImageNotFoundException(testId, imagePath);
      orchestrator.getTestImage.mockRejectedValue(error);

      await expect(
        controller.getTestImage(testId, imagePath, mockResponse),
      ).rejects.toThrow(PsyTestImageNotFoundException);
    });
  });

  describe('getTestMarks', () => {
    it('should call orchestrator and return marks system', async () => {
      const testId: UUID = randomUUID();
      const marksSystem = { data: 'some-marks-data' };
      orchestrator.getTestMarksSystem.mockResolvedValue(marksSystem);

      const result: unknown = await controller.getTestMarks(testId);

      expect(orchestrator.getTestMarksSystem).toHaveBeenCalledWith(testId);
      expect(result).toEqual(marksSystem);
    });

    it('should propagate error from orchestrator', async () => {
      const testId: UUID = randomUUID();
      const error = new PsyTestNotFoundException(testId);
      orchestrator.getTestMarksSystem.mockRejectedValue(error);

      await expect(controller.getTestMarks(testId)).rejects.toThrow(
        PsyTestNotFoundException,
      );
    });
  });
});
