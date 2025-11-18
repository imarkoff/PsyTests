import { GrpcTestsEngineGateway } from '../../../infrastructure/grpc/grpc-tests-engine.gateway';
import {
  GetAllTestsResponse,
  GetTestByIdRequest,
  GetTestByIdResponse,
  TestsEngineClient,
} from '../../../domain/interfaces/tests-engine.client';
import { Test } from '@nestjs/testing';
import {
  TESTS_ENGINE_NAME,
  TESTS_PACKAGE_NAME,
} from '../../../domain/constants/tests-package.constant';
import { ClientGrpc } from '@nestjs/microservices';
import { of } from 'rxjs';
import { UUID, randomUUID } from 'node:crypto';
import { createPsyTestFixture } from '../../fixtures/psy-test.fixture';
import { PsyTest } from '../../../domain/entities/psy-test.entity';
import {
  GrpcFetcher,
  GrpcFetcherWithSuccessProps,
} from '../../../../shared/grpc/application/grpc-fetcher/grpc-fetcher.abstract';
import { PsyTestWithDetails } from '../../../domain/entities/psy-test-with-details.entity';
import { ServiceError, status } from '@grpc/grpc-js';

describe(GrpcTestsEngineGateway.name, () => {
  let gateway: GrpcTestsEngineGateway;

  const testsClient: Omit<jest.Mocked<TestsEngineClient>, ''> = {
    getAllTests: jest.fn(),
    getTestById: jest.fn(),
    getTestByIdWithoutAnswers: jest.fn(),
    getTestMetadataById: jest.fn(),
    getTestImage: jest.fn(),
    getTestMarksSystem: jest.fn(),
  };

  const grpcFetcher: Pick<jest.Mocked<GrpcFetcher>, 'fetch'> = {
    fetch: jest.fn(),
  };

  const getServiceMock: jest.MockedFunction<ClientGrpc['getService']> = jest
    .fn()
    .mockImplementation((name: string) => {
      if (name === TESTS_ENGINE_NAME) {
        return testsClient;
      }
      return null;
    });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GrpcTestsEngineGateway,
        {
          provide: TESTS_PACKAGE_NAME,
          useValue: {
            getService: getServiceMock,
          },
        },
        {
          provide: GrpcFetcher,
          useValue: grpcFetcher,
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
    it('should correctly call testsClient.getAllTests', async () => {
      const observable = of({ tests: [] });
      testsClient.getAllTests.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue({ tests: [] });

      await gateway.getAllTests();

      expect(testsClient.getAllTests).toHaveBeenCalledWith({});
    });

    it('should correctly call grpcFetcher.fetch', async () => {
      const getAllTestsResponse = { tests: [] };
      const observable = of(getAllTestsResponse);
      testsClient.getAllTests.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(getAllTestsResponse);

      await gateway.getAllTests();

      expect(grpcFetcher.fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          request: observable,
        }),
      );
    });

    it('should return result from grpcFetcher.fetch', async () => {
      const expectedResult: PsyTest[] = [createPsyTestFixture()];
      const getAllTestsResponse = { tests: expectedResult };
      testsClient.getAllTests.mockReturnValue(of(getAllTestsResponse));
      grpcFetcher.fetch.mockResolvedValue(expectedResult);

      const result = await gateway.getAllTests();

      expect(result).toBe(expectedResult);
    });

    it('should return array of test on grpcFetcher.fetch', async () => {
      const mockTests: PsyTest[] = [createPsyTestFixture()];
      const getAllTestsResponse = { tests: mockTests };
      testsClient.getAllTests.mockReturnValue(of(getAllTestsResponse));
      grpcFetcher.fetch.mockResolvedValue(getAllTestsResponse);

      await gateway.getAllTests();
      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        GetAllTestsResponse,
        PsyTest[],
        void
      >;
      const onSuccessResult = fetchCall.onSuccess(getAllTestsResponse);

      expect(onSuccessResult).toEqual(mockTests);
    });
  });

  describe('getTestById', () => {
    it('correctly calls testsClient.getTestById', async () => {
      const testId: UUID = randomUUID();
      const observable = of({ json: '' });
      testsClient.getTestById.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(null);

      await gateway.getTestById(testId);

      expect(testsClient.getTestById).toHaveBeenCalledWith({ testId });
    });

    it('correctly calls grpcFetcher.fetch', async () => {
      const testId: UUID = randomUUID();
      const observable = of({ json: '' });
      testsClient.getTestById.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(null);

      await gateway.getTestById(testId);

      expect(grpcFetcher.fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          request: observable,
        }),
      );
    });

    it('should return result from grpcFetcher.fetch', async () => {
      const testId: UUID = randomUUID();
      const expectedResult: PsyTestWithDetails | null = createPsyTestFixture();
      testsClient.getTestById.mockReturnValue(of({ json: '' }));
      grpcFetcher.fetch.mockResolvedValue(expectedResult);

      const result = await gateway.getTestById(testId);

      expect(result).toBe(expectedResult);
    });

    it('should return the parsed test when the tests engine returns test json', async () => {
      const mockTest = createPsyTestFixture({
        someValue: 'test-data',
      });
      const getTestResult = { json: JSON.stringify(mockTest) };
      testsClient.getTestById.mockReturnValue(of(getTestResult));
      grpcFetcher.fetch.mockResolvedValue(getTestResult);

      await gateway.getTestById(mockTest.id);
      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        GetTestByIdResponse,
        PsyTestWithDetails,
        null
      >;
      const onSuccessResult = fetchCall.onSuccess(getTestResult);

      expect(onSuccessResult).toEqual(mockTest);
    });

    it('should return null if the tests engine returns NOT_FOUND', async () => {
      const testId: UUID = randomUUID();
      const statusError = {
        code: status.NOT_FOUND,
      } as ServiceError;
      testsClient.getTestById.mockReturnValue(of({ json: '' }));

      await gateway.getTestById(testId);
      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        GetTestByIdResponse,
        PsyTestWithDetails,
        null
      >;
      const onFailureResult =
        fetchCall.onFailure![status.NOT_FOUND]!(statusError);

      expect(onFailureResult).toBeNull();
    });
  });

  describe('getTestByIdWithoutAnswers', () => {
    it('should call testsClient.getTestByIdWithoutAnswers and return the parsed test', async () => {
      const testId: UUID = randomUUID();
      const mockTest: PsyTestWithDetails = createPsyTestFixture();
      const response = { json: JSON.stringify(mockTest) };
      const observable = of(response);

      testsClient.getTestByIdWithoutAnswers.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(mockTest);

      const result = await gateway.getTestByIdWithoutAnswers(testId);

      expect(testsClient.getTestByIdWithoutAnswers).toHaveBeenCalledWith({
        testId,
      });
      expect(grpcFetcher.fetch).toHaveBeenCalledWith(
        expect.objectContaining({ request: observable }),
      );
      expect(result).toEqual(mockTest);
    });

    it('should return null when the tests engine returns NOT_FOUND', async () => {
      const testId: UUID = randomUUID();
      const statusError = {
        code: status.NOT_FOUND,
      } as ServiceError;
      testsClient.getTestByIdWithoutAnswers.mockReturnValue(of({ json: '' }));
      grpcFetcher.fetch.mockResolvedValue(null);

      await gateway.getTestByIdWithoutAnswers(testId);

      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        GetTestByIdResponse,
        PsyTestWithDetails,
        null
      >;
      const onFailureResult =
        fetchCall.onFailure![status.NOT_FOUND]!(statusError);

      expect(onFailureResult).toBeNull();
    });
  });

  describe('getTestMetadataById', () => {
    it('should call testsClient.getTestMetadataById and return metadata', async () => {
      const testId: UUID = randomUUID();
      const mockMetadata: PsyTest = createPsyTestFixture();
      const observable = of(mockMetadata);

      testsClient.getTestMetadataById.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(mockMetadata);

      const result = await gateway.getTestMetadataById(testId);

      expect(testsClient.getTestMetadataById).toHaveBeenCalledWith({
        testId,
      });
      expect(grpcFetcher.fetch).toHaveBeenCalledWith(
        expect.objectContaining({ request: observable }),
      );
      expect(result).toEqual(mockMetadata);
    });

    it('should return null when the tests engine returns NOT_FOUND', async () => {
      const testId: UUID = randomUUID();
      const statusError = {
        code: status.NOT_FOUND,
      } as ServiceError;
      testsClient.getTestMetadataById.mockReturnValue(of());
      const fetchCallPromise = gateway.getTestMetadataById(testId);

      grpcFetcher.fetch.mockResolvedValue(null);
      await fetchCallPromise;

      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        GetTestByIdRequest,
        PsyTest,
        null
      >;
      const onFailureResult =
        fetchCall.onFailure![status.NOT_FOUND]!(statusError);

      expect(onFailureResult).toBeNull();
    });
  });

  describe('getTestImage', () => {
    it('should call testsClient.getTestImage and return the image data', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'images/pic.png';
      const mockImageData = Buffer.from('mock-image');
      const observable = of({ imageData: mockImageData });

      testsClient.getTestImage.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(mockImageData);

      const result = await gateway.getTestImage(testId, imagePath);

      expect(testsClient.getTestImage).toHaveBeenCalledWith({
        testId,
        imagePath,
      });
      expect(grpcFetcher.fetch).toHaveBeenCalledWith(
        expect.objectContaining({ request: observable }),
      );
      expect(result).toEqual(mockImageData);
    });

    it('should return null when image data is missing', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'images/missing.png';
      testsClient.getTestImage.mockReturnValue(
        of({ imageData: undefined } as unknown as { imageData: Buffer }),
      );
      grpcFetcher.fetch.mockResolvedValue(null);

      const result = await gateway.getTestImage(testId, imagePath);

      expect(result).toBeNull();
    });

    it('should return null when the tests engine returns NOT_FOUND', async () => {
      const testId: UUID = randomUUID();
      const imagePath = 'images/notfound.png';
      const statusError = {
        code: status.NOT_FOUND,
      } as ServiceError;
      testsClient.getTestImage.mockReturnValue(of());
      grpcFetcher.fetch.mockResolvedValue(null);

      await gateway.getTestImage(testId, imagePath);

      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        { imageData?: Buffer },
        Buffer,
        null
      >;
      const onFailureResult =
        fetchCall.onFailure![status.NOT_FOUND]!(statusError);

      expect(onFailureResult).toBeNull();
    });
  });

  describe('getTestMarksSystem', () => {
    it('should call testsClient.getTestMarksSystem and return the marks system', async () => {
      const testId: UUID = randomUUID();
      const mockMarksSystem = { scale: 'A', values: [1, 2, 3] };
      const observable = of({
        marksSystemJson: JSON.stringify(mockMarksSystem),
      });

      testsClient.getTestMarksSystem.mockReturnValue(observable);
      grpcFetcher.fetch.mockResolvedValue(mockMarksSystem);

      const result = await gateway.getTestMarksSystem(testId);

      expect(testsClient.getTestMarksSystem).toHaveBeenCalledWith({
        testId,
      });
      expect(grpcFetcher.fetch).toHaveBeenCalledWith(
        expect.objectContaining({ request: observable }),
      );
      expect(result).toEqual(mockMarksSystem);
    });

    it('should return null when the marks system json is missing', async () => {
      const testId: UUID = randomUUID();
      testsClient.getTestMarksSystem.mockReturnValue(
        of({ marksSystemJson: undefined } as unknown as {
          marksSystemJson: string;
        }),
      );
      grpcFetcher.fetch.mockResolvedValue(null);

      const result = await gateway.getTestMarksSystem(testId);

      expect(result).toBeNull();
    });

    it('should return null when the tests engine returns NOT_FOUND', async () => {
      const testId: UUID = randomUUID();
      const statusError = {
        code: status.NOT_FOUND,
      } as ServiceError;
      testsClient.getTestMarksSystem.mockReturnValue(
        of({ marksSystemJson: '' }),
      );
      grpcFetcher.fetch.mockResolvedValue(null);

      await gateway.getTestMarksSystem(testId);

      const fetchCall = grpcFetcher.fetch.mock
        .calls[0][0] as GrpcFetcherWithSuccessProps<
        { marksSystemJson?: string },
        object | [],
        null
      >;
      const onFailureResult =
        fetchCall.onFailure![status.NOT_FOUND]!(statusError);

      expect(onFailureResult).toBeNull();
    });
  });
});
