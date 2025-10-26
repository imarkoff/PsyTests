import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import validator from 'validator';
import { PasswordConfig } from '../config/password.config';

@ValidatorConstraint({ name: 'IsPasswordValid', async: false })
@Injectable()
export class PasswordConstraint implements ValidatorConstraintInterface {
  constructor(private readonly config: ConfigService) {}

  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    const cfg = this.config.get<PasswordConfig>('password');
    if (!cfg) {
      throw new Error('Password configuration is not defined.');
    }

    if (value.length > cfg.maxLength) return false;

    return validator.isStrongPassword(value, {
      minLength: cfg.minLength,
      minLowercase: cfg.minLowercase,
      minUppercase: cfg.minUppercase,
      minNumbers: cfg.minNumbers,
      minSymbols: cfg.minSymbols,
    });
  }

  defaultMessage(): string {
    return (
      'Password should be a valid string ' +
      'with at least $constraint1 characters long (max $constraint2), ' +
      'including at least $constraint3 lowercase letter(s), ' +
      '$constraint4 uppercase letter(s), ' +
      '$constraint5 number(s), and $constraint6 special character(s).'
    );
  }
}

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordConstraint,
    });
  };
}
