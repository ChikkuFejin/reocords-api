import { z } from 'zod';

export const createParticipantDtoScheme = z.object({
  institution_id: z.number().positive().optional().nullable(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  roll_number: z.string().max(100).optional().nullable(),
  password_hash: z.string().min(1, 'Password hash is required'),
  email: z.string().email().max(255).optional().nullable(),
  phone_number: z.string().max(20).optional().nullable(),
  standard_id: z.number().positive('Standard ID is required'),
  standard_section_ids: z.array(z.number().positive()).optional().default([]),
});

export type CreateParticipantDto = z.infer<typeof createParticipantDtoScheme>;

