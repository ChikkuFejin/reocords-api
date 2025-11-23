import { z } from 'zod';

export const createStandardSectionDtoScheme = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Name too long'),
  standard_id: z.number().positive('Standard ID is required'),
  is_active: z.boolean().default(true),
});

export type CreateStandardSectionDto = z.infer<typeof createStandardSectionDtoScheme>;

