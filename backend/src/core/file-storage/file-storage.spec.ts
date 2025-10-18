import { FileStorageServiceImpl } from './file-storage.service';
import { FileSystemService } from './file-system/file-system.interface';
import { UUIDValidator } from '../validations/uuid-validator/uuid-validator.interface';
import { FileStorageEntityValidator } from './validations/file-storage-entity-validator/file-storage-entity-validator.interface';
import { PathTraversalValidator } from './validations/path-traversal-validator/path-traversal-validator.interface';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import { FileNotFoundError } from '../exceptions/file-storage/file-not-found.error';
import { DirectoryNotFoundError } from '../exceptions/file-storage/directory-not-found.error';
import { UUID } from 'node:crypto';
import { FileNoAccessError } from '../exceptions/file-storage/file-no-access.error';

describe('FileStorageServiceImpl', () => {
  let service: FileStorageServiceImpl;
  let mockFs: jest.Mocked<FileSystemService>;
  let mockUuidValidator: jest.Mocked<UUIDValidator>;
  let mockEntityValidator: jest.Mocked<FileStorageEntityValidator>;
  let mockPathTraversalValidator: jest.Mocked<PathTraversalValidator>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockFs = {
      readFile: jest.fn(),
      readDir: jest.fn(),
    } as jest.Mocked<FileSystemService>;

    mockUuidValidator = {
      isValid: jest.fn(),
    } as jest.Mocked<UUIDValidator>;

    mockEntityValidator = {
      isValid: jest.fn(),
    } as jest.Mocked<FileStorageEntityValidator>;

    mockPathTraversalValidator = {
      isValid: jest.fn(),
    } as jest.Mocked<PathTraversalValidator>;

    mockConfigService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    mockLogger = {
      error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'fileDbBasePath') return '/base';
      if (key === 'fileDbEntityFileName') return 'entity.json';
      return undefined;
    });

    service = new FileStorageServiceImpl(
      mockFs,
      mockUuidValidator,
      mockEntityValidator,
      mockPathTraversalValidator,
      mockConfigService,
      mockLogger,
    );
  });

  describe('getById', () => {
    it('should return parsed JSON when entity and id are valid and file exists', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockResolvedValue('{"key": "value"}');

      const result = await service.getById(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual({ key: 'value' });
    });

    it('should return null when file is not found', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockRejectedValue(new FileNotFoundError(''));

      const result = await service.getById(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toBe(null);
    });

    it('should return null when file has no access', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockRejectedValue(new FileNoAccessError(''));

      const result = await service.getById(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toBe(null);
    });

    it('should throw error when other error occurs', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockRejectedValue(new Error('Other error'));

      await expect(
        service.getById('entity', '550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow('Other error');
    });

    it('should throw EntityIsInvalidError when entity is invalid', async () => {
      mockEntityValidator.isValid.mockReturnValue(false);

      await expect(
        service.getById('invalid', '550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow('Invalid entity name.');
    });

    it('should throw UUIDIsInvalidError when id is invalid', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(false);

      await expect(
        service.getById('entity', 'invalid' as UUID),
      ).rejects.toThrow('Invalid UUID has been provided.');
    });
  });

  describe('getAll', () => {
    it('should return array of entities when entity is valid and directory exists with ids', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockFs.readDir.mockResolvedValue(['id1', 'id2']);
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockFs.readFile
        .mockResolvedValueOnce('{"data": "1"}')
        .mockResolvedValueOnce('{"data": "2"}');

      const result = await service.getAll('entity');

      expect(result).toEqual([{ data: '1' }, { data: '2' }]);
    });

    it('should return empty array when directory is empty', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockFs.readDir.mockResolvedValue([]);

      const result = await service.getAll('entity');

      expect(result).toEqual([]);
    });

    it('should throw EntityIsInvalidError when entity does not exist', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockFs.readDir.mockRejectedValue(new DirectoryNotFoundError(''));

      await expect(service.getAll('entity')).rejects.toThrow(
        'The specified entity does not exist.',
      );
    });

    it('should throw error when other error occurs reading directory', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockFs.readDir.mockRejectedValue(new Error('Other error'));

      await expect(service.getAll('entity')).rejects.toThrow('Other error');
    });

    it('should throw EntityIsInvalidError when entity is invalid', async () => {
      mockEntityValidator.isValid.mockReturnValue(false);

      await expect(service.getAll('invalid')).rejects.toThrow(
        'Invalid entity name.',
      );
    });
  });

  describe('getEntityFile', () => {
    it('should return file content when entity and id are valid and path is within base and file exists', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockPathTraversalValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockResolvedValue('content');

      const result = await service.getEntityFile(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
        'file.txt',
      );

      expect(result).toBe('content');
    });

    it('should return null when file is not found', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockPathTraversalValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockRejectedValue(new FileNotFoundError(''));

      const result = await service.getEntityFile(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
        'file.txt',
      );

      expect(result).toBe(null);
    });

    it('should return null when path traversal is detected', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockPathTraversalValidator.isValid.mockReturnValue(false);

      const result = await service.getEntityFile(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
        '../outside.txt',
      );

      expect(result).toBe(null);
    });

    it('should return null when other error occurs', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(true);
      mockPathTraversalValidator.isValid.mockReturnValue(true);
      mockFs.readFile.mockRejectedValue(new Error('Other error'));

      const result = await service.getEntityFile(
        'entity',
        '550e8400-e29b-41d4-a716-446655440000',
        'file.txt',
      );

      expect(result).toBe(null);
    });

    it('should throw EntityIsInvalidError when entity is invalid', async () => {
      mockEntityValidator.isValid.mockReturnValue(false);

      await expect(
        service.getEntityFile(
          'invalid',
          '550e8400-e29b-41d4-a716-446655440000',
          'file.txt',
        ),
      ).rejects.toThrow('Invalid entity name.');
    });

    it('should throw UUIDIsInvalidError when id is invalid', async () => {
      mockEntityValidator.isValid.mockReturnValue(true);
      mockUuidValidator.isValid.mockReturnValue(false);

      await expect(
        service.getEntityFile('entity', 'invalid' as UUID, 'file.txt'),
      ).rejects.toThrow('Invalid UUID has been provided.');
    });
  });
});
