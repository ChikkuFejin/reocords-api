import { z } from 'zod';

export const updateQuestionSourceDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .required();

export type UpdateQuestionSourceDto = z.infer<
  typeof updateQuestionSourceDtoScheme
>;
