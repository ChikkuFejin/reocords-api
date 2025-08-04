import { z } from 'zod';

export const loginDtoScheme = z
  .object({
  user_name: z.string().min(1),
  password: z.string().min(6),
}).required();

export type LoginDto = z.infer<typeof loginDtoScheme>;
