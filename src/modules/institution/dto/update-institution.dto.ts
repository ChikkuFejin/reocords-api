import { z } from 'zod';

export const updateInstitutionDtoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  gst: z.string().max(50).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  mobile: z.string().max(20).optional().nullable(),
  type: z.string().min(1, 'type is required').max(50),
});

export type UpdateInstitutionDto = z.infer<typeof updateInstitutionDtoSchema>;
