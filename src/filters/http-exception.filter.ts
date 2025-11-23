// src/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { mapMySQLError } from '../helpers/mysql-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = exception.message;

    if (exception instanceof HttpException) {
      status =
        (exception.getResponse() as any).statusCode ?? exception.getStatus();
      message = exception.message;
      error = (exception.getResponse() as any).error ?? null;
    }

    if (exception instanceof QueryFailedError) {
      const driverError = (exception as any).driverError;
      const mapped = mapMySQLError(driverError.code, driverError.sqlMessage);
      console.log('[mapped]',mapped);
      status = mapped.status;
      message = mapped.message;
      error = mapped.error;
    }

    console.error('🔴 Exception caught:', exception);

    res.status(status).json({
      statusCode: status,
      message,
      error,
      data: null,
    });
  }
}
