import { z } from 'zod';

export const createInstitutionDtoSchema = z.object({
  name: z.string().min(1, 'name is required').max(255),
  gst: z.string().max(50).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  mobile: z.string().max(20).optional().nullable(),
});

export type CreateInstitutionDto = z.infer<typeof createInstitutionDtoSchema>;
