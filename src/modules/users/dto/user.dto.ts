import { z } from 'zod';

export const createUserDtoScheme = z
  .object({
    institution_id: z.number().nullable().optional().default(null),
    username: z.string(),
    id: z.number().nullable().optional().default(null),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserDtoScheme>;
export type UpdateUserDto = z.infer<typeof createUserDtoScheme>;
