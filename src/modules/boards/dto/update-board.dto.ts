import { z } from 'zod';

// Base schema for board
const boardBaseSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character'),
  description: z.string().optional(),
});

// Update schema - all fields optional
export const updateBoardDtoScheme = boardBaseSchema.partial();

export type UpdateBoardDto = z.infer<typeof updateBoardDtoScheme>;
