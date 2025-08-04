import { z } from 'zod';

export const createcomplexityLevelDtoScheme = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type CreateComplexityLevelDto = z.infer<
  typeof createcomplexityLevelDtoScheme
>;
