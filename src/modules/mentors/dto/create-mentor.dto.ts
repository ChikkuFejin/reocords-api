import { z } from 'zod';

const numericStringSchema = z
  .string()
  .regex(/^\d+$/, 'Value must be a number represented as string')
  .transform((val) => Number(val));

export const mentorSectionEntryScheme = z.object({
  standard_section_id: z.number().positive('Standard section ID is required'),
  categories: z
    .array(z.union([z.number().positive(), numericStringSchema]))
    .optional(),
});

export type MentorSectionEntryDto = z.infer<typeof mentorSectionEntryScheme>;

export const createMentorDtoScheme = z.object({
  institution_id: z.number().positive().optional().nullable(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  phone_number: z.string().max(20).optional().nullable(),
  username: z.string().min(1, 'Username is required').max(255, 'Username too long'),
  password: z.string().min(1, 'Password is required'),
  is_active: z.boolean().default(true),
  sections: z.array(mentorSectionEntryScheme).optional(),
});

export type CreateMentorDto = z.infer<typeof createMentorDtoScheme>;

