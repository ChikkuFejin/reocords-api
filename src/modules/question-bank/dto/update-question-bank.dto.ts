import { z } from 'zod';

export const updateQuestionBankDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional().default(''),
  })
  .required();

export type UpdateQuestionBankDto = z.infer<typeof updateQuestionBankDtoScheme>;
