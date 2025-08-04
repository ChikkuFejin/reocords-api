import { z } from 'zod';

export const createTopicsDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional().default(''),
  })
  .required();

export const updateTopicsDtoScheme = z
  .object({
    name: z.string().min(1),
    description: z.string().optional().default(''),
  })
  .required();

export type CreateTopicsDto = z.infer<typeof createTopicsDtoScheme>;
export type UpdateTopicsDto = z.infer<typeof updateTopicsDtoScheme>;
