import { PathTraversalValidatorImpl } from './path-traversal-validator.service';

describe('PathTraversalValidatorImpl', () => {
  let validator: PathTraversalValidatorImpl;

  beforeEach(() => {
    validator = new PathTraversalValidatorImpl();
  });

  describe('isValid', () => {
    it('should return true when fullPath is within basePath', () => {
      const result = validator.isValid('/base', '/base/subdir/file.txt');

      expect(result).toBe(true);
    });

    it('should return true when fullPath equals basePath with separator', () => {
      const result = validator.isValid('/base', '/base/');

      expect(result).toBe(true);
    });

    it('should return false when fullPath is outside basePath', () => {
      const result = validator.isValid('/base', '/other/file.txt');

      expect(result).toBe(false);
    });

    it('should return false for path traversal attempt with dot dot', () => {
      const result = validator.isValid('/base', '/base/../outside/file.txt');

      expect(result).toBe(false);
    });

    it('should return true for nested paths within basePath', () => {
      const result = validator.isValid('/base', '/base/dir1/dir2/file.txt');

      expect(result).toBe(true);
    });

    it('should return false when fullPath is parent of basePath', () => {
      const result = validator.isValid('/base/sub', '/base/file.txt');

      expect(result).toBe(false);
    });

    it('should handle relative basePath correctly', () => {
      const result = validator.isValid('base', 'base/sub/file.txt');

      expect(result).toBe(true);
    });

    it('should return false for absolute fullPath when basePath is relative', () => {
      const result = validator.isValid('base', '/absolute/file.txt');

      expect(result).toBe(false);
    });

    it('should return true for same normalized paths', () => {
      const result = validator.isValid('/base/./', '/base/file.txt');

      expect(result).toBe(true);
    });

    it('should return false for empty basePath', () => {
      const result = validator.isValid('', '/file.txt');

      expect(result).toBe(false);
    });

    it('should return false for empty fullPath', () => {
      const result = validator.isValid('/base', '');

      expect(result).toBe(false);
    });
  });
});
