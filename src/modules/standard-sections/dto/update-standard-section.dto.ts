import { z } from 'zod';

export const updateStandardSectionDtoScheme = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Name too long').optional(),
  standard_id: z.number().positive('Standard ID is required').optional(),
  is_active: z.boolean().optional(),
});

export type UpdateStandardSectionDto = z.infer<typeof updateStandardSectionDtoScheme>;

