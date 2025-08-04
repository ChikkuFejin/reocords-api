import { z } from 'zod';

export const createBoardDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional().default(''),
  })
  .required();

export type CreateBoardDto = z.infer<typeof createBoardDtoScheme>;
