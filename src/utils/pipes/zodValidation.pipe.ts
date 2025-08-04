import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { serviceResponse } from '../../helpers/response';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errorDetails = result.error.issues.map((err) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message || 'Validation error',
      }));
      throw new BadRequestException(serviceResponse.validation(errorDetails));
    }
    return result.data;
  }
}
