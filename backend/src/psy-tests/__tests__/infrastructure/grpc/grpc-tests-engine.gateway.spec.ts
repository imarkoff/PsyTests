/* eslint-disable @typescript-eslint/unbound-method */
import { GrpcTestsEngineGateway } from '../../../infrastructure/grpc/grpc-tests-engine.gateway';
import { TestsEngineClient } from '../../../domain/interfaces/tests-engine.client';
import { Test } from '@nestjs/testing';
import {
  TESTS_ENGINE_NAME,
  TESTS_PACKAGE_NAME,
} from '../../../domain/constants/tests-package.constant';
import { ClientGrpc } from '@nestjs/microservices';
import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { of } from 'rxjs';
import { createPsyTestDtoFixture } from '../../fixtures/psy-test-dto.fixture';
import { UUID, randomUUID } from 'node:crypto';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

describe(GrpcTestsEngineGateway.name, () => {
  let gateway: GrpcTestsEngineGateway;

  const mockTestsClient: jest.Mocked<TestsEngineClient> = {
    getAllTests: jest.fn(),
    getTestById: jest.fn(),
    getTestByIdWithoutAnswers: jest.fn(),
    getTestImage: jest.fn(),
    getTestMarksSystem: jest.fn(),
  };

  const getServiceMock: jest.MockedFunction<ClientGrpc['getService']> = jest
    .fn()
    .mockImplementation((name: string) => {
      if (name === TESTS_ENGINE_NAME) {
        return mockTestsClient;
      }
      return null;
    });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GrpcTestsEngineGateway,
        {
          provide: TESTS_PACKAGE_NAME,
          useValue: {
            getService: getServiceMock,
          },
        },
      ],
    }).compile();

    gateway = module.get(GrpcTestsEngineGateway);
  });

  describe('onModuleInit', () => {
    it('should initialize testsClient', () => {
      gateway.onModuleInit();
      expect(getServiceMock).toHaveBeenCalledWith(TESTS_ENGINE_NAME);
    });
  });

  beforeEach(() => {
    gateway.onModuleInit();
  });

  describe('getAllTests', () => {
    it('should call testsClient.getAllTests and return the tests', async () => {
      const mockTests: PsyTestDto[] = [createPsyTestDtoFixture()];
      mockTestsClient.getAllTests.mockReturnValue(of({ tests: mockTests }));

      const result = await gateway.getAllTests();

      expect(mockTestsClient.getAllTests).toHaveBeenCalledWith({});
      expect(result).toEqual(mockTests);
    });

    it('should return an empty array if the tests engine returns no tests', async () => {
      mockTestsClient.getAllTests.mockReturnValue(of({ tests: [] }));

      const result = await gateway.getAllTests();

      expect(mockTestsClient.getAllTests).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });
  });

  describe('getTestById', () => {
    it('should call testsClient.getTestById and return the parsed test', async () => {
      const testId: UUID = randomUUID();
      const mockTest: PsyTestWithDetailsDto = createPsyTestDtoFixture();
      mockTestsClient.getTestById.mockReturnValue(
        of({ json: JSON.stringify(mockTest) }),
      );

      const result = await gateway.getTestById(testId);

      expect(mockTestsClient.getTestById).toHaveBeenCalledWith({ testId });
      expect(result).toEqual(mockTest);
    });

    it('should return null if the tests engine returns no test json', async () => {
      const testId: UUID = randomUUID();
      mockTestsClient.getTestById.mockReturnValue(of({ json: undefined }));

      const result = await gateway.getTestById(testId);

      expect(mockTestsClient.getTestById).toHaveBeenCalledWith({ testId });
      expect(result).toBeNull();
    });
  });

  describe('getTestByIdWithoutAnswers', () => {
    it('should call testsClient.getTestByIdWithoutAnswers and return the parsed test', async () => {
      const testId: UUID = randomUUID();
      const mockTest: PsyTestWithDetailsDto = createPsyTestDtoFixture();
      mockTestsClient.getTestByIdWithoutAnswers.mockReturnValue(
        of({ json: JSON.stringify(mockTest) }),
      );

      const result = await gateway.getTestByIdWithoutAnswers(testId);

      expect(mockTestsClient.getTestByIdWithoutAnswers).toHaveBeenCalledWith({
        testId,
      });
      expect(result).toEqual(mockTest);
    });

    it('should return null if the tests engine returns no test json', async () => {
      const testId: UUID = randomUUID();
      mockTestsClient.getTestByIdWithoutAnswers.mockReturnValue(
        of({ json: undefined }),
      );

      const result = await gateway.getTestByIdWithoutAnswers(testId);

      expect(mockTestsClient.getTestByIdWithoutAnswers).toHaveBeenCalledWith({
        testId,
      });
      expect(result).toBeNull();
    });
  });

  describe('getTestImage', () => {
    it('should call testsClient.getTestImage and return the image data', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'path/to/image.png';
      const mockImageData = Buffer.from('mock-image-data');
      mockTestsClient.getTestImage.mockReturnValue(
        of({ imageData: mockImageData }),
      );

      const result = await gateway.getTestImage(testId, imagePath);

      expect(mockTestsClient.getTestImage).toHaveBeenCalledWith({
        testId,
        imagePath,
      });
      expect(result).toEqual(mockImageData);
    });

    it('should return null if the tests engine returns no image data', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'path/to/image.png';
      mockTestsClient.getTestImage.mockReturnValue(
        of({ imageData: undefined }),
      );

      const result = await gateway.getTestImage(testId, imagePath);

      expect(mockTestsClient.getTestImage).toHaveBeenCalledWith({
        testId,
        imagePath,
      });
      expect(result).toBeNull();
    });
  });

  describe('getTestMarksSystem', () => {
    it('should call testsClient.getTestMarksSystem and return the parsed marks system', async () => {
      const testId: UUID = randomUUID();
      const mockMarksSystem = { key: 'value' };
      mockTestsClient.getTestMarksSystem.mockReturnValue(
        of({ marksSystemJson: JSON.stringify(mockMarksSystem) }),
      );

      const result = await gateway.getTestMarksSystem(testId);

      expect(mockTestsClient.getTestMarksSystem).toHaveBeenCalledWith({
        testId,
      });
      expect(result).toEqual(mockMarksSystem);
    });

    it('should return null if the tests engine returns no marks system json', async () => {
      const testId: UUID = randomUUID();
      mockTestsClient.getTestMarksSystem.mockReturnValue(
        of({ marksSystemJson: undefined }),
      );

      const result = await gateway.getTestMarksSystem(testId);

      expect(mockTestsClient.getTestMarksSystem).toHaveBeenCalledWith({
        testId,
      });
      expect(result).toBeNull();
    });
  });
});
