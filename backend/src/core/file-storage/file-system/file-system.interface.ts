/**
 * Interface for file system operations.
 * Defines methods for reading files and directories.
 */
export abstract class FileSystemService {
  /**
   * Reads a file from the specified path.
   * @param path - The path to the file.
   * @param options - Optional encoding options.
   * @returns A promise that resolves to the file content as a string or Buffer.
   * @throws FileNoAccessError if the file cannot be accessed (permission denied)
   * @throws FileNotFoundError if the file does not exist.
   */
  abstract readFile(
    path: string,
    options?: BufferEncoding | { encoding?: BufferEncoding | null },
  ): Promise<string | Buffer>;

  /**
   * Reads the contents of a directory from the specified path.
   * @param path - The path to the directory.
   * @returns A promise that resolves to an array of file and directory names.
   * @throws DirectoryNotFoundError if the directory does not exist.
   */
  abstract readDir(path: string): Promise<string[]>;
}
