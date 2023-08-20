import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR_MSG, LOGS_FOLDER_PATH } from './constants';
import { join } from 'path';
import { appendFile, readdir, stat, mkdir } from 'fs/promises';
import * as dotenv from 'dotenv';
import { checkItemExistence } from './validation';

dotenv.config();

export const createLogsFolder = async () => {
  const isFolderExists = await checkItemExistence(LOGS_FOLDER_PATH);

  if (!isFolderExists) {
    await mkdir(LOGS_FOLDER_PATH);
  }
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : INTERNAL_SERVER_ERROR_MSG;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

export const writeLogs = async (logType: string, message: string) => {
  const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 10000;

  await createLogsFolder();

  const logsFiles = await readdir(LOGS_FOLDER_PATH);

  const currentFileToWrightIdx = parseInt(
    logsFiles
      .filter((file) => file.includes(logType))
      .map((item) => item.replace(/\D/g, ''))
      .sort()
      .at(-1),
    10,
  );

  const fileName = `${logType}-${currentFileToWrightIdx || 0}.log`;

  let filePath = join(LOGS_FOLDER_PATH, fileName);
  const isFileExists = await checkItemExistence(filePath);

  if (isFileExists) {
    const { size } = await stat(filePath);

    if (size >= maxFileSize) {
      filePath = join(
        LOGS_FOLDER_PATH,
        `${logType}-${currentFileToWrightIdx + 1}.log`,
      );
    }
  }

  appendFile(filePath, `${message}\n`, { flag: 'a' });
};
