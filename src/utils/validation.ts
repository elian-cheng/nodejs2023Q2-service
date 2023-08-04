import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
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

export const removeItemFromCollections = (
  otherCollections: any[],
  key: string,
  value: string,
) => {
  otherCollections.find((collection) => {
    const item = collection.find((item) => item[key] === value);
    if (!item) return;
    item[key] = null;
  });
};

export const removeItemFromFavorites = (
  collection: string[],
  id: string,
  itemBelongsTo: string,
  isInFavorites = false,
) => {
  const ERROR_MESSAGE = `${itemBelongsTo} with :id ${id} was not found in favorites`;
  const itemIndex = collection.findIndex((item) => item === id);
  if (itemIndex === -1 && isInFavorites) {
    throw new NotFoundException(ERROR_MESSAGE);
  } else if (itemIndex === -1) {
    return;
  }
  collection.splice(itemIndex, 1);
};

export const responseOnSuccess = (item: string, id: string) => {
  return `${item} with :id ${id} successfully added to favorites`;
};
