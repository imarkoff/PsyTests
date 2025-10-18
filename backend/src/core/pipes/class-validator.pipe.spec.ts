import { ArgumentMetadata, BadRequestException, Type } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ClassValidatorPipe } from './class-validator.pipe';

class TestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

describe('ClassValidatorPipe', () => {
  let pipe: ClassValidatorPipe;

  beforeEach(() => {
    pipe = new ClassValidatorPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return the original value when validation is successful', async () => {
    const value = { name: 'test' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
    };

    await expect(pipe.transform(value, metadata)).resolves.toEqual(value);
  });

  it('should throw a BadRequestException when validation fails', async () => {
    const value = { name: 123 }; // Invalid type
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw a BadRequestException with "Validation failed" message', async () => {
    const value = {}; // Missing property
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      'Validation failed',
    );
  });

  it('should let the value pass through when there is no metatype', async () => {
    const value = { name: 'test' };
    const metadata: ArgumentMetadata = { type: 'body' };

    await expect(pipe.transform(value, metadata)).resolves.toEqual(value);
  });

  const primitiveTypes: [string, Type<unknown>][] = [
    ['String', String],
    ['Boolean', Boolean],
    ['Number', Number],
    ['Array', Array],
    ['Object', Object],
  ];

  it.each(primitiveTypes)(
    'should let the value pass through for primitive type %s',
    async (_, metatype) => {
      const value = { someKey: 'someValue' };
      const metadata: ArgumentMetadata = { type: 'body', metatype };

      await expect(pipe.transform(value, metadata)).resolves.toEqual(value);
    },
  );
});
