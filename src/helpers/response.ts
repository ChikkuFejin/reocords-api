import { STATUS_CODES } from '../constants/http-status-codes';
import { HttpResponseMessages } from '../constants/http-response-messages';

export interface StructureResponseInterface {
  statusCode: number;
  message: string;
  data: any;
  error: any;
}

export const serviceResponse = {
  success(data: any, message: string = 'Success'): unknown {
    return this.structure(STATUS_CODES.SUCCESS, message, data);
  },

  failure(
    message: string = HttpResponseMessages.INTERNAL_SERVER_ERROR,
  ): StructureResponseInterface {
    return this.structure(STATUS_CODES.INTERNAL_ERROR, message, null, null);
  },

  validation(error: unknown): StructureResponseInterface {
    return this.structure(
      STATUS_CODES.VALIDATION_FAILED,
      HttpResponseMessages.VALIDATION_ERROR,
      null,
      error,
    );
  },

  notFoundError(
    message: string = HttpResponseMessages.NOT_FOUND,
  ): StructureResponseInterface {
    return this.structure(STATUS_CODES.RESOURCE_NOT_FOUND, message);
  },

  unAuthorizedError(): StructureResponseInterface {
    return this.structure(
      STATUS_CODES.UNAUTHORIZED,
      HttpResponseMessages.UNAUTHORIZED,
    );
  },

  invalidTokenError(
    message: string = HttpResponseMessages.INVALID_TOKEN,
  ): StructureResponseInterface {
    return this.structure(STATUS_CODES.UNAUTHORIZED, message);
  },

  structure(
    code: number,
    message: string,
    data: any = null,
    error: any = null,
  ): StructureResponseInterface {
    return {
      statusCode: code,
      message,
      data,
      error,
    };
  },
};
