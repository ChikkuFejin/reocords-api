import { z } from 'zod';

export const createInstitutionUserDtoSchema = z
    .object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        type: z.string().min(3),
    })
    .required();

export type CreateInstitutionUserDto = z.infer<
    typeof createInstitutionUserDtoSchema
>;
