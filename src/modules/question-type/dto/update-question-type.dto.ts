
import { z } from 'zod';

export const updateQuestionTypeDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional()
  })
  .required();

export type UpdateQuestionTypeDto = z.infer<typeof updateQuestionTypeDtoScheme>;
