import { FileStorageEntityValidatorImpl } from './file-storage-entity-validator.service';

describe('FileStorageEntityValidatorImpl', () => {
  let validator: FileStorageEntityValidatorImpl;

  beforeEach(() => {
    validator = new FileStorageEntityValidatorImpl();
  });

  describe('isValid', () => {
    it('should return true for valid entity name with letters and numbers', () => {
      const result = validator.isValid('file123');

      expect(result).toBe(true);
    });

    it('should return true for valid entity name with underscores', () => {
      const result = validator.isValid('my_file');

      expect(result).toBe(true);
    });

    it('should return true for valid entity name with hyphens', () => {
      const result = validator.isValid('my-file');

      expect(result).toBe(true);
    });

    it('should return true for valid entity name with mixed characters', () => {
      const result = validator.isValid('File_123-test');

      expect(result).toBe(true);
    });

    it('should return true for single character valid entity name', () => {
      const result = validator.isValid('a');

      expect(result).toBe(true);
    });

    it('should return false for empty string', () => {
      const result = validator.isValid('');

      expect(result).toBe(false);
    });

    it('should return false for entity name with spaces', () => {
      const result = validator.isValid('file name');

      expect(result).toBe(false);
    });

    it('should return false for entity name with dots', () => {
      const result = validator.isValid('file.txt');

      expect(result).toBe(false);
    });

    it('should return false for entity name with special characters', () => {
      const result = validator.isValid('file@name');

      expect(result).toBe(false);
    });

    it('should return false for entity name starting with space', () => {
      const result = validator.isValid(' file');

      expect(result).toBe(false);
    });

    it('should return false for entity name with uppercase and lowercase mix but invalid char', () => {
      const result = validator.isValid('File.Name');

      expect(result).toBe(false);
    });
  });
});
