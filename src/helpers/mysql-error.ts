
import { HttpStatus } from '@nestjs/common';

export function mapMySQLError(code: string, message: string) {
  switch (code) {
    case 'ER_DUP_ENTRY':
      return {
        status: HttpStatus.CONFLICT,
        message: 'Duplicate entry',
        error: message,
      };

    case 'ER_NO_REFERENCED_ROW':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Foreign key constraint failed',
        error: message,
      };

    case 'ER_BAD_NULL_ERROR':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Null value not allowed',
        error: message,
      };

    case 'ER_DATA_TOO_LONG':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Data too long for column',
        error: message,
      };

    default:
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Database error',
        error: message,
      };
  }
}