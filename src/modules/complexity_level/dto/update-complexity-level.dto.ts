import { z } from 'zod';

export const updateComplexityLevelDtoScheme = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type UpdateComplexityLevelDto = z.infer<
  typeof updateComplexityLevelDtoScheme
>;
