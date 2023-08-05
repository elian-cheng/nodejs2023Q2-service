import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

const SOURCE_NAMES = ['Album', 'Artist', 'Track', 'User'];

export const checkItemExistence = async (
  allItems: Repository<any>,
  itemId: string,
  itemBelongsTo: string,
  isFavs = false,
) => {
  const ERROR_MESSAGE = `${itemBelongsTo} with :id ${itemId} was not found in database`;
  const item = await allItems.findOne({ where: { id: itemId } });

  if (isFavs && !item) {
    throw new UnprocessableEntityException(ERROR_MESSAGE);
  } else if (!item && SOURCE_NAMES.includes(itemBelongsTo)) {
    throw new NotFoundException(ERROR_MESSAGE);
  } else if (!item) {
    throw new BadRequestException(ERROR_MESSAGE);
  }
};

export const checkValidId = (itemId: string) => {
  if (!uuid.validate(itemId)) {
    throw new BadRequestException(`Received Id ${itemId} is not uuid`);
  }
};

export const checkItemValidation = (
  allItems: Repository<any>,
  itemId: string,
  itemBelongsTo: string,
) => {
  checkValidId(itemId);
  checkItemExistence(allItems, itemId, itemBelongsTo);
};

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
