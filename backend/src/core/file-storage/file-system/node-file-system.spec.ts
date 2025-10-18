import { NodeFileSystemService } from './node-file-system.service';
import { readFile, readdir } from 'fs/promises';
import { FileNotFoundError } from '../../exceptions/file-storage/file-not-found.error';
import { DirectoryNotFoundError } from '../../exceptions/file-storage/directory-not-found.error';
import { FileNoAccessError } from '../../exceptions/file-storage/file-no-access.error';
import { Dirent } from 'node:fs';

jest.mock('fs/promises');

describe('NodeFileSystemService', () => {
  let service: NodeFileSystemService;

  beforeEach(() => {
    service = new NodeFileSystemService();
  });

  describe('readFile', () => {
    it('should read file successfully', async () => {
      const mockContent = 'file content';
      (readFile as jest.MockedFunction<typeof readFile>).mockResolvedValue(
        mockContent,
      );

      const result = await service.readFile('path/to/file.txt');

      expect(result).toBe(mockContent);
      expect(readFile).toHaveBeenCalledWith('path/to/file.txt', undefined);
    });

    it('should read file with options successfully', async () => {
      const mockContent = Buffer.from('file content');
      const options = { encoding: 'utf8' as const };
      (readFile as jest.MockedFunction<typeof readFile>).mockResolvedValue(
        mockContent,
      );

      const result = await service.readFile('path/to/file.txt', options);

      expect(result).toBe(mockContent);
      expect(readFile).toHaveBeenCalledWith('path/to/file.txt', options);
    });

    it('should throw FileNotFoundError when file does not exist', async () => {
      const error = new Error('ENOENT') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      (readFile as jest.MockedFunction<typeof readFile>).mockRejectedValue(
        error,
      );

      await expect(service.readFile('path/to/nonexistent.txt')).rejects.toThrow(
        FileNotFoundError,
      );
      await expect(service.readFile('path/to/nonexistent.txt')).rejects.toThrow(
        'File not found at path: path/to/nonexistent.txt',
      );
    });

    it('should throw FileNoAccessError when access is denied', async () => {
      const error = new Error('EACCES') as NodeJS.ErrnoException;
      error.code = 'EACCES';
      (readFile as jest.MockedFunction<typeof readFile>).mockRejectedValue(
        error,
      );

      await expect(service.readFile('path/to/denied.txt')).rejects.toThrow(
        FileNoAccessError,
      );
      await expect(service.readFile('path/to/denied.txt')).rejects.toThrow(
        'No access to file at path: path/to/denied.txt',
      );
    });

    it('should rethrow other errors', async () => {
      const error = new Error('Some other error') as NodeJS.ErrnoException;
      error.code = 'OTHER';
      (readFile as jest.MockedFunction<typeof readFile>).mockRejectedValue(
        error,
      );

      await expect(service.readFile('path/to/file.txt')).rejects.toThrow(error);
    });
  });

  describe('readDir', () => {
    it('should read directory successfully', async () => {
      const mockFiles = ['file1.txt', 'file2.txt'];
      (readdir as jest.MockedFunction<typeof readdir>).mockResolvedValue(
        mockFiles as unknown as Dirent<Buffer<ArrayBufferLike>>[],
      );

      const result = await service.readDir('path/to/dir');

      expect(result).toEqual(mockFiles);
      expect(readdir).toHaveBeenCalledWith('path/to/dir');
    });

    it('should throw DirectoryNotFoundError when directory does not exist', async () => {
      const error = new Error('ENOENT') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      (readdir as jest.MockedFunction<typeof readdir>).mockRejectedValue(error);

      await expect(service.readDir('path/to/nonexistent')).rejects.toThrow(
        DirectoryNotFoundError,
      );
      await expect(service.readDir('path/to/nonexistent')).rejects.toThrow(
        'Directory not found at path: path/to/nonexistent',
      );
    });

    it('should rethrow other errors', async () => {
      const error = new Error('Some other error') as NodeJS.ErrnoException;
      error.code = 'OTHER';
      (readdir as jest.MockedFunction<typeof readdir>).mockRejectedValue(error);

      await expect(service.readDir('path/to/dir')).rejects.toThrow(error);
    });
  });
});
