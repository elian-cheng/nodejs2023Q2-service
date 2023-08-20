import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { access } from 'fs/promises';
import { SetMetadata } from '@nestjs/common';

export const responseOnSuccess = (item: string, id: string) => {
  return `${item} with :id ${id} successfully added to favorites`;
};

export const responseOnError = (field: string) =>
  `Field ${field} should be a string or null`;

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: StringOrNullConstraint,
    });
  };
}

export const checkItemExistence = async (path: string) => {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
};

@ValidatorConstraint({ name: 'IsStringOrNull' })
export class StringOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' || value === null;
  }
}

export const Public = () => SetMetadata('isPublic', true);
