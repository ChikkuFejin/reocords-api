import { z } from 'zod';

export const createQuestionTypeDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional()
  })
  .required();

export type CreateQuestionTypeDto = z.infer<typeof createQuestionTypeDtoScheme>;
