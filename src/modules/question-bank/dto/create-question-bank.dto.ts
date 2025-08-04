import { z } from 'zod';

// Question Media
const QuestionMediaSchema = z.object({
  type: z.string(),
  path: z.string(),
  is_active: z.boolean(),
});

// Option Media
const OptionMediaSchema = z.object({
  type: z.string(),
  path: z.string(),
  is_active: z.boolean(),
});

// MCQ Option
const MCQOptionSchema = z.object({
  option_text: z.string(),
  is_correct_answer: z.boolean(),
  is_active: z.boolean(),
  option_media: z.array(OptionMediaSchema).optional(),
});

// Explanation Media
const ExplanationMediaSchema = z.object({
  type: z.string(),
  path: z.string(),
  is_active: z.boolean(),
});

// Explanation
const ExplanationSchema = z.object({
  explanation: z.string(),
  answer_keywords: z.string().optional().nullable(),
  explanation_media: z.array(ExplanationMediaSchema).optional(),
});

// Main CreateQuestion DTO
export const createQuestionBankDtoSchema = z.object({
  question_text: z.string(),
  question_type_id: z.number(),
  category_id: z.number(),
  source_id: z.number(),
  mark: z.number(),
  answerable_time_seconds: z.number(),
  complexity_level_id: z.number(),
  mcq_selection: z.string().optional().nullable().default(null),
  created_by: z.string().optional().nullable().default(null),
  verified_by: z.string().optional().nullable().default(null),
  status: z.enum(['draft', 'publish']),
  evaluation_method: z.enum(['AI', 'MANUAL']).optional().nullable(),
  board_id: z.number(),
  question_media: z.array(QuestionMediaSchema).optional(),
  mcq_options: z.array(MCQOptionSchema),
  explanation: ExplanationSchema,
  clear_existing_media: z.array(z.number()).optional().default([]),
  clear_existing_options: z.array(z.number()).optional().default([]),
  clear_options_media: z.array(z.number()).optional().default([]),
});

// const mcqOptionsSchema = z.array(MCQOptionSchema);

export type CreateQuestionBankDto = z.infer<typeof createQuestionBankDtoSchema>;
export type McqOptionDto = z.infer<typeof MCQOptionSchema>;
