import { UuidValidatorImpl } from './uuid-validator.service';

describe('UuidValidatorImpl', () => {
  let validator: UuidValidatorImpl;

  beforeEach(() => {
    validator = new UuidValidatorImpl();
  });

  describe('isValid', () => {
    it('should return true for valid UUID v4', () => {
      const result = validator.isValid('550e8400-e29b-41d4-a716-446655440000');

      expect(result).toBe(true);
    });

    it('should return true for valid UUID v1', () => {
      const result = validator.isValid('6ba7b810-9dad-11d1-80b4-00c04fd430c8');

      expect(result).toBe(true);
    });

    it('should return false for invalid UUID string', () => {
      const result = validator.isValid('not-a-uuid');

      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = validator.isValid('');

      expect(result).toBe(false);
    });

    it('should return false for UUID with invalid characters', () => {
      const result = validator.isValid('550e8400-e29b-41d4-a716-44665544000g');

      expect(result).toBe(false);
    });

    it('should return false for UUID with wrong length', () => {
      const result = validator.isValid('550e8400-e29b-41d4-a716-44665544000');

      expect(result).toBe(false);
    });

    it('should return false for UUID missing hyphens', () => {
      const result = validator.isValid('550e8400e29b41d4a716446655440000');

      expect(result).toBe(false);
    });

    it('should return false for null input', () => {
      const result = validator.isValid(null as unknown as string);

      expect(result).toBe(false);
    });

    it('should return false for undefined input', () => {
      const result = validator.isValid(undefined as unknown as string);

      expect(result).toBe(false);
    });
  });
});
