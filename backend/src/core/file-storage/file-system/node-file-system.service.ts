import { FileSystemService } from './file-system.interface';
import { readFile, readdir } from 'fs/promises';
import { FileNotFoundError } from '../../exceptions/file-storage/file-not-found.error';
import { DirectoryNotFoundError } from '../../exceptions/file-storage/directory-not-found.error';
import { FileNoAccessError } from '../../exceptions/file-storage/file-no-access.error';

export class NodeFileSystemService implements FileSystemService {
  async readFile(
    path: string,
    options?: BufferEncoding | { encoding?: BufferEncoding | null },
  ): Promise<string | Buffer> {
    try {
      return await readFile(path, options);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new FileNotFoundError('File not found at path: ' + path);
      }
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new FileNoAccessError('No access to file at path: ' + path);
      }
      throw error;
    }
  }

  async readDir(path: string): Promise<string[]> {
    try {
      return await readdir(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new DirectoryNotFoundError(
          'Directory not found at path: ' + path,
        );
      }
      throw error;
    }
  }
}
