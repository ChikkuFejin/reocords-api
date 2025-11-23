import { z } from 'zod';
import { mentorSectionEntryScheme } from './create-mentor.dto';

const mentorBaseSchema = z.object({
  institution_id: z.number().positive().optional().nullable(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  phone_number: z.string().max(20).optional().nullable(),
  username: z.string().min(1, 'Username is required').max(255, 'Username too long'),
  password: z.string().min(1, 'Password is required'),
  is_active: z.boolean(),
  sections: z.array(mentorSectionEntryScheme).optional(),
});

export const updateMentorDtoScheme = mentorBaseSchema.partial();

export type UpdateMentorDto = z.infer<typeof updateMentorDtoScheme>;

