import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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

@ValidatorConstraint({ name: 'IsStringOrNull' })
export class StringOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' || value === null;
  }
}
