import { z } from 'zod';

export const updateBoardDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional().default(''),
  })
  .required();

export type UpdateBoardDto = z.infer<typeof updateBoardDtoScheme>;
