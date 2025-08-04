import { z } from 'zod';

export const updateCategoryDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    parent_id: z.number().nullable().optional().default(null),
    is_active: z.boolean().optional().default(true),
  })
  .required();

export type UpdateCategoryDto = z.infer<typeof updateCategoryDtoScheme>;
