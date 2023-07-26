import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';

const RESOURCES_NAMES = ['Album', 'Artist', 'Track', 'User'];

const checkItemExistence = (
  allItems: any[],
  itemId: string,
  itemBelongsTo: string,
) => {
  const ERR_MSG = `${itemBelongsTo} with :id ${itemId} is not found in database`;
  const item = allItems.find((item) => item.id === itemId);

  if (!item && RESOURCES_NAMES.includes(itemBelongsTo)) {
    throw new NotFoundException(ERR_MSG);
  } else if (!item) {
    throw new BadRequestException(ERR_MSG);
  }
};

const checkValidId = (itemId: string) => {
  if (!uuid.validate(itemId)) {
    throw new BadRequestException('Received Id ${itemId} is not uuid');
  }
};

const checkItemValidation = (
  allItems: any[],
  itemId: string,
  itemBelongsTo: string,
) => {
  checkValidId(itemId);
  checkItemExistence(allItems, itemId, itemBelongsTo);
};

const removeItemFromCollections = (
  otherCollections: any[],
  key: string,
  value: string,
) => {
  otherCollections.find((collection) => {
    const item = collection.find((item) => item[key] === value);
    item[key] = null;
  });
};

export {
  checkItemExistence,
  checkValidId,
  checkItemValidation,
  removeItemFromCollections,
};
