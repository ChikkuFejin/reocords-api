import { z } from 'zod';

export const createCategoryDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    parent_id: z.number().optional().nullable(),
    is_active: z.boolean().optional().nullable().default(true),
    standard_id: z.number().optional().nullable(),
  })
  .required();

export type CreateCategoryDto = z.infer<typeof createCategoryDtoScheme>;
