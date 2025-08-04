import { ZodSchema } from 'zod';
import { BadRequestException, HttpException } from '@nestjs/common';
import { serviceResponse } from './response';

export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log('[result]', result);
    const errorDetails = result.error.issues.map((err) => ({
      field: err.path?.join('.') || 'unknown',
      message: err.message || 'Validation error',
    }));
    throw new BadRequestException(serviceResponse.validation(errorDetails));
  }

  return result.data;
}
