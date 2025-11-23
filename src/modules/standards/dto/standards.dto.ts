import { z } from 'zod';

export const createStandardDtoScheme = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  // institution_id: z.number().optional(), // if you want it required, use z.number().int().positive()
});

export const sectionScheme = z.object({
  name: z.string().min(1, 'Name is required'),
  id: z.number().positive().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const standardSectionDtoScheme = z.object({
  id: z.number().positive().optional().nullable(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  institution_id: z.number().optional(), // if you want it required, use z.number().int().positive()
  categories: z.array(z.number().positive()).optional().default([]),
});
export const standardSectionScheme = z.object({
  standard: standardSectionDtoScheme,
  sections: z.array(sectionScheme).min(1, 'Section is required'),
});
export type CreateStandardDto = z.infer<typeof createStandardDtoScheme>;
export type UpdateStandardDto = z.infer<typeof createStandardDtoScheme>;
export type standardSectionDto = z.infer<typeof standardSectionScheme>;
