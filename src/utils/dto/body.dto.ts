import { z } from 'zod';

export const bodyDto = z
  .object({
    module: z.string(),
    action: z.string(),
    data: z.optional(z.object()),
  })
  .required();

export type BodyDto = z.infer<typeof bodyDto>;
