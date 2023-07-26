import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';

const checkItemExistence = (allItems: any[], itemId: string) => {
  const item = allItems.find((item) => item.id === itemId);
  if (!item) {
    throw new NotFoundException(`Item with :id ${itemId} not found`);
  }
};

const checkValidId = (itemId: string) => {
  if (!uuid.validate(itemId)) {
    throw new BadRequestException(`Received Id ${itemId} is not uuid`);
  }
};

export { checkItemExistence, checkValidId };
