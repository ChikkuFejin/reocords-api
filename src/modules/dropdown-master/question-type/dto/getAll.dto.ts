import { z } from 'zod';

export const questionTypeGetAllDtoScheme = z
  .object({
    query: z.string().min(1).optional()
  })
  .required();

export type QuestionTypeGetAllDto = z.infer<typeof questionTypeGetAllDtoScheme>;
