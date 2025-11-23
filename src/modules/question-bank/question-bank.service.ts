import { Injectable } from '@nestjs/common';
import {
  CreateQuestionBankDto,
  McqOptionDto,
} from './dto/create-question-bank.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, Like } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionMedia } from '../../entities/question-media.entity';
import { McqOption } from '../../entities/mcq-option.entity';
import { McqOptionMedia } from '../../entities/mcq-option-media.entity';
import { QuestionExplanation } from '../../entities/question-explanations.entity';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(Question)
    private repo: Repository<Question>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  create(dto: CreateQuestionBankDto) {
    return this.dataSource.transaction(async (manager) => {
      const question = manager.create(Question, {
        questionText: dto.question_text,
        questionType: { id: dto.question_type_id },
        category: { id: dto.category_id },
        source: { id: dto.source_id },
        mark: dto.mark,
        answerable_time_seconds: dto.answerable_time_seconds,
        complexityLevel: { id: dto.complexity_level_id },
        mcq_selection: dto.mcq_selection,
        created_by: dto.created_by,
        verified_by: dto.verified_by,
        status: dto.status,
        evaluation_method: dto.evaluation_method,
        board: { id: dto.board_id },
      } as any);

      // Save question first
      const savedQuestion = await manager.save(Question, question);

      // Save media (if any)
      if (dto.question_media?.length) {
        const mediaEntities = dto.question_media.map((media) =>
          manager.create(QuestionMedia, {
            ...media,
            question: savedQuestion,
          }),
        );
        await manager.save(QuestionMedia, mediaEntities);
      }

      // Save MCQ options (with optional media)
      const optionEntities = dto.mcq_options.map((option) => {
        const optionEntity = manager.create(McqOption, {
          ...option,
          question: savedQuestion,
        });

        if (option.option_media?.length) {
          optionEntity.option_media = option.option_media.map((media) =>
            manager.create(McqOptionMedia, {
              ...media,
              option: optionEntity,
            }),
          );
        }

        return optionEntity;
      });
      await manager.save(McqOption, optionEntities);

      // Save Explanation
      const explanation = manager.create(QuestionExplanation, {
        explanation: dto.explanation.explanation,
        answer_keywords: dto.explanation.answer_keywords || null,
        question: savedQuestion,
      } as any);

      await manager.save(QuestionExplanation, explanation);

      return savedQuestion;
    });
  }

  findAll(query: { search?: string } | null = null) {
    const sqlQuery = {
      relations: [
        'question_media',
        'mcq_options',
        'mcq_options.option_media',
        'explanation',
        'explanation.explanation_media',
        'questionType',
        'category',
        'source',
        'complexityLevel',
        'board',
      ],
    };

    if (query?.search) {
      console.log(query.search);
      sqlQuery['where'] = {
        questionText: Like(`%${query.search}%`),
      };
    }
    console.log('query', query);

    return this.repo.find(sqlQuery);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: [
        'question_media',
        'mcq_options',
        'mcq_options.option_media',
        'explanation',
        'explanation.explanation_media',
        'questionType',
        'category',
        'source',
        'complexityLevel',
        'board',
      ],
    });
  }

  async update(id: number, dto: CreateQuestionBankDto, question: Question) {
    return this.dataSource.transaction(async (manager) => {
      question.questionText = dto.question_text;
      question.mark = dto.mark;
      question.answerable_time_seconds = dto.answerable_time_seconds;
      question.mcq_selection = dto?.mcq_selection || null;
      question.status = dto.status;
      question.evaluation_method = dto.evaluation_method as 'AI' | 'MANUAL';
      question.verified_by = dto?.verified_by || undefined;
      question.category = { id: dto.category_id } as any;
      question.source = { id: dto.source_id } as any;
      question.questionType = { id: dto.question_type_id } as any;
      question.complexityLevel = { id: dto.complexity_level_id } as any;
      question.board = { id: dto.board_id } as any;

      // Save updated question
      const updatedQuestion = await manager.save(Question, question);

      //delete old media/options if replacing completely
      const clearExistingMedia: number[] = dto?.clear_existing_media ?? [];
      if (clearExistingMedia.length > 0) {
        await manager.delete(QuestionMedia, { id: In(clearExistingMedia) });
      }

      const clearExtistingOptions: number[] = dto?.clear_existing_options ?? [];
      if (clearExtistingOptions.length > 0) {
        await manager.softDelete(McqOption, { id: In(clearExtistingOptions) });
      }

      const clearingOptionMedia: number[] = dto?.clear_options_media ?? [];
      if (clearingOptionMedia.length > 0) {
        await manager.delete(McqOptionMedia, { id: In(clearingOptionMedia) });
      }

      const mcqOptions: McqOptionDto[] = dto.mcq_options ?? [];
      if (mcqOptions.length > 0) {
        const mcqOptionsEntitty = mcqOptions.map((opt: McqOptionDto) => {
          return manager.create(McqOption, {
            ...opt,
            question: updatedQuestion,
          });
        });
        await manager.save(McqOption, mcqOptionsEntitty);
      }

      // // Add new media (if provided)
      // if (dto.question_media?.length) {
      //   const mediaEntities = dto.question_media.map((media) =>
      //     manager.create(QuestionMedia, {
      //       ...media,
      //       question: updatedQuestion,
      //     }),
      //   );
      //   await manager.save(QuestionMedia, mediaEntities);
      // }
      //
      // // Add or update options
      // if (dto.mcq_options?.length) {
      //   const optionEntities = dto.mcq_options.map((option) =>
      //     manager.create(McqOption, {
      //       ...option,
      //       question: updatedQuestion,
      //     }),
      //   );
      //   await manager.save(McqOption, optionEntities);
      // }
      //
      // // Update explanation
      // if (dto.explanation) {
      //   const explanation = await manager.findOne(QuestionExplanation, {
      //     where: { question: { id } },
      //   });
      //
      //   if (explanation) {
      //     explanation.explanation = dto.explanation.explanation;
      //     explanation.answer_keywords = dto.explanation
      //       .answer_keywords as string;
      //     await manager.save(QuestionExplanation, explanation);
      //   } else {
      //     const newExplanation = manager.create(QuestionExplanation, {
      //       explanation: dto.explanation.explanation,
      //       answer_keywords: dto.explanation.answer_keywords as string,
      //       question: updatedQuestion,
      //     } as any);
      //     await manager.save(QuestionExplanation, newExplanation);
      //   }
      // }

      return updatedQuestion;
    });
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
