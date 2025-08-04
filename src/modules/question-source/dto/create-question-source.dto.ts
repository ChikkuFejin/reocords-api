import { z } from 'zod';

export const createQuestionSourceDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .required();

export type CreateQuestionSourceDto = z.infer<
  typeof createQuestionSourceDtoScheme
>;
