import { cwd } from 'process';
import { join } from 'path';

export const LOGS_FOLDER = 'logs';
export const LOGS_FOLDER_PATH = join(cwd(), LOGS_FOLDER);
export enum LOGGING_LEVELS {
  LOG,
  ERROR,
  WARN,
  DEBUG,
  VERBOSE,
}

export const INTERNAL_SERVER_ERROR_MSG = 'Internal server error';
