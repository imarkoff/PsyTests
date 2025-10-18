import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * A NestJS pipe that validates incoming request data
 * against defined class-validator decorators.
 * If validation fails, it throws a BadRequestException.
 *
 * @example
 * ```ts
 * // In a controller
 * @Post()
 * async create(@Body(new ClassValidatorPipe()) createDto: CreateDto) {
 *   // handle the valid createDto
 * }
 * ```
 */
@Injectable()
export class ClassValidatorPipe implements PipeTransform {
  async transform<T extends object>(value: T, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const parsedObject = plainToInstance(metatype, value) as T;
    const validationErrors = await validate(parsedObject);
    if (validationErrors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: ArgumentMetadata['metatype']): boolean {
    if (!metatype) {
      return false;
    }

    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
