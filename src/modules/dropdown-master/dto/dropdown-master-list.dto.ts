import { z } from 'zod';

export const dropDownMasterDtoScheme = z
  .object({
    drop_key: z.array(z.enum(['question-type'])).min(1),
  })
  .required();

export type DropdownMasterListDto = z.infer<typeof dropDownMasterDtoScheme>;
