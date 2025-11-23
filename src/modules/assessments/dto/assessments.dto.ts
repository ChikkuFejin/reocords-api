import { z } from 'zod';

export const createAssessmentSectionDtoSchema = z.object({
  id: z.number().int().positive().optional(),
  assessment_id: z.number().int().positive().optional(),
  name: z.string().min(1),
  total_question_count: z.number().int().nonnegative(),
  positive_mark: z.number().nonnegative().default(0),
  negative_mark: z.number().nonnegative().default(0),
  total_duration_minutes: z.number().int().nonnegative().nullable().optional(),
  status: z.enum(['draft', 'publish']),
});

export const assessmentDtoSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  category_id: z.number().int().positive(),
  topic_id: z.number().int().positive(),
  total_marks: z.number().nonnegative(),
  examination_duration_minutes: z.string().min(1), // since it is VARCHAR(50)
  examination_code: z.string().min(1),
  type: z.enum(['prebuild', 'schedule']),
  schedule_date: z.string().datetime().optional().nullable(),
  is_question_timed: z.boolean(),
  question_time_seconds: z.string().optional().nullable(),
  question_pick: z.enum(['auto', 'manual']),
  is_homework: z.boolean(),
  is_question_shuffle: z.boolean(),
  is_display_result: z.boolean(),
  reminder_time_to_end_seconds: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),
  created_by: z.string().min(1),
  reviewed_by: z.string().optional().nullable(),
  board_id: z.number().int().positive(),
  sections: z.array(createAssessmentSectionDtoSchema).min(1),
  clear_existing_sections: z.array(z.number()).optional().default([]),
  standards: z.array(z.number()).optional().default([]),
});

export const assesssmentSectionAddQuestionSchemeDto = z.object({
  section_id: z.number().int().positive(),
  question_ids: z.array(z.number().int().positive().optional()),
  remove_questions_id: z.array(z.number().int().positive().optional()),
});

export const questionMappingDtoSchema = z.array(
  assesssmentSectionAddQuestionSchemeDto,
);

export const assesssmentSectionAddQuestionsSchema = z.object({
  question_mapping: z.array(assesssmentSectionAddQuestionSchemeDto).min(1),
});

export type assessmentSectionsDto = z.infer<
  typeof createAssessmentSectionDtoSchema
>;
export type CreateAssessmentDto = z.infer<typeof assessmentDtoSchema>;
export type UpdateAssessmentDto = z.infer<typeof assessmentDtoSchema>;

export type addQuestionDto = z.infer<
  typeof assesssmentSectionAddQuestionsSchema
>;

export type QuestionMappingDto = z.infer<
  typeof assesssmentSectionAddQuestionSchemeDto
>;
