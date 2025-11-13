import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import validator from 'validator';
import {
  PasswordConfig,
  PasswordConfigGetter,
} from '../config/configs/password';

@Injectable()
@ValidatorConstraint({ name: 'IsPasswordValid', async: false })
export class PasswordConstraint implements ValidatorConstraintInterface {
  private readonly passwordConfig: PasswordConfig;

  constructor(passwordConfigGetter: PasswordConfigGetter) {
    this.passwordConfig = passwordConfigGetter.get();
  }

  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    if (value.length > this.passwordConfig.maxLength) return false;

    return validator.isStrongPassword(value, {
      minLength: this.passwordConfig.minLength,
      minLowercase: this.passwordConfig.minLowercase,
      minUppercase: this.passwordConfig.minUppercase,
      minNumbers: this.passwordConfig.minNumbers,
      minSymbols: this.passwordConfig.minSymbols,
    });
  }

  defaultMessage(): string {
    const {
      minLength,
      maxLength,
      minLowercase,
      minUppercase,
      minNumbers,
      minSymbols,
    } = this.passwordConfig;

    return (
      'Password should be a valid string ' +
      `with at least ${minLength} characters long (max ${maxLength}), ` +
      `including at least ${minLowercase} lowercase letter(s), ` +
      `${minUppercase} uppercase letter(s), ` +
      `${minNumbers} number(s), and ${minSymbols} special character(s).`
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
