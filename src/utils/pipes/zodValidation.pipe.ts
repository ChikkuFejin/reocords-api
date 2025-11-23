import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { serviceResponse } from '../../helpers/response';
import { validateWithZod } from '../../helpers/zod-validator';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    console.log('[ZodValidationPipe]', value);
    return validateWithZod(this.schema, value);
  }
}
