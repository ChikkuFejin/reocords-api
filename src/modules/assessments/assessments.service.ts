import { Injectable } from '@nestjs/common';
import {
  addQuestionDto,
  assessmentSectionsDto,
  CreateAssessmentDto,
  QuestionMappingDto,
  UpdateAssessmentDto,
} from './dto/assessments.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Assessment } from '../../entities/assessment.entity';
import {
  AssessmentSection,
  AssessmentSectionStatus,
} from '../../entities/assessment-section.entity';
import { McqOptionDto } from '../question-bank/dto/create-question-bank.dto';
import { McqOption } from '../../entities/mcq-option.entity';
import { AssessmentStandard } from '../../entities/assessment_standard.entity';
import { SectionQuestion } from '../../entities/section-questions.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private repo: Repository<Assessment>,
    @InjectRepository(AssessmentSection)
    private assessmentsSectionRepo: Repository<AssessmentSection>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateAssessmentDto) {
    return await this.dataSource.transaction(async (manager) => {
      const {
        sections,
        category_id,
        topic_id,
        board_id,
        standards,
        ...assessmentData
      } = dto;
      const assessment = manager.create(Assessment, {
        ...assessmentData,
        category: { id: category_id },
        board: { id: board_id },
        topic: { id: topic_id },
        sections: sections.map((section: AssessmentSection) =>
          manager.create(AssessmentSection, section),
        ),
      } as any);
      const savedAssessment = await manager.save(assessment);
      // 2. Create mapping for standards
      if (Array.isArray(standards) && standards.length > 0) {
        const assessmentStandardsEntities = standards.map((standardId) =>
          manager.create(AssessmentStandard, {
            assessment: { id: savedAssessment.id },
            standard: { id: standardId },
            institution_id: null, // or set if you know it from standard
          }),
        );
        await manager.save(assessmentStandardsEntities);
      }

      return savedAssessment;
    });
  }

  findAll() {
    return this.repo.find({
      relations: ['assessmentStandards.standard'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: [
        'assessmentStandards.standard',
        'sections.sectionQuestions.question',
      ],
    });
  }

  update(assessment: Assessment, dto: UpdateAssessmentDto) {
    return this.dataSource.transaction(async (manager) => {
      const {
        sections,
        category_id,
        topic_id,
        board_id,
        standards,
        ...assessmentData
      } = dto;

      const existingStandards = await manager.find(AssessmentStandard, {
        where: { assessment: { id: assessment.id } },
      });

      if (existingStandards.length > 0) {
        const extistingStandardIds = existingStandards.map(
          (standard) => standard.id,
        );
        await manager.delete(AssessmentStandard, extistingStandardIds);
      }

      const editedAssesment = manager.create(Assessment, {
        ...assessmentData,
        id: assessment.id,
        category: { id: category_id },
        board: { id: board_id },
        topic: { id: topic_id },
      } as any);

      const updatedAssessment = await manager.save(editedAssesment);

      // create or update the sections
      const incomingSections: assessmentSectionsDto[] = sections ?? [];
      const toSave: AssessmentSection[] = [];

      for (const opt of incomingSections) {
        const id = opt.id ? Number(opt.id) : undefined;

        if (id) {
          // Try to load the existing (managed) entity for this assessment
          const existing = await manager.findOne(AssessmentSection, {
            where: { id, assessment: { id: Number(updatedAssessment.id) } },
          });

          if (existing) {
            // Mutate the managed entity so TypeORM will UPDATE it
            existing.name = opt.name ?? existing.name;
            existing.total_question_count =
              opt.total_question_count ?? existing.total_question_count;
            existing.positive_mark =
              opt.positive_mark ?? existing.positive_mark;
            existing.negative_mark =
              opt.negative_mark ?? existing.negative_mark;
            existing.total_duration_minutes =
              opt.total_duration_minutes ?? existing.total_duration_minutes;
            existing.status = opt.status ?? existing.status;
            // (don't set existing.id)
            toSave.push(existing);
          } else {
            // Incoming id not found. Either throw or create a new row.
            // Here we create a new section (without id) to avoid duplicate-PK insert.
            console.warn(
              `Section id ${id} not found for assessment ${updatedAssessment.id}. Creating new section instead.`,
            );
            const newSection = manager.create(AssessmentSection, {
              name: opt.name,
              total_question_count: opt.total_question_count,
              positive_mark: opt.positive_mark ?? 0,
              negative_mark: opt.negative_mark ?? 0,
              total_duration_minutes: opt.total_duration_minutes ?? null,
              status: opt.status ?? AssessmentSectionStatus.DRAFT,
              assessment: { id: Number(updatedAssessment.id) },
            } as AssessmentSection);
            toSave.push(newSection);
          }
        } else {
          // New section (no id) -> create
          const newSection = manager.create(AssessmentSection, {
            name: opt.name,
            total_question_count: opt.total_question_count,
            positive_mark: opt.positive_mark ?? 0,
            negative_mark: opt.negative_mark ?? 0,
            total_duration_minutes: opt.total_duration_minutes ?? null,
            status: opt.status ?? AssessmentSectionStatus.DRAFT,
            assessment: { id: Number(updatedAssessment.id) },
          } as AssessmentSection);
          toSave.push(newSection);
        }
      }

      // Save once. TypeORM will run UPDATE for managed entities and INSERT for new ones.
      if (toSave.length > 0) {
        await manager.save(AssessmentSection, toSave);
      }

      const existingSections = await manager.find(AssessmentSection, {
        where: { assessment: { id: assessment.id } },
      });

      const incomingIds = incomingSections
        .filter((s) => s.id)
        .map((s) => Number(s.id));

      // 2. Identify sections that are in DB but not in the incoming payload
      const sectionsToDelete = existingSections.filter(
        (existing) => !incomingIds.includes(Number(existing.id)),
      );

      if (sectionsToDelete.length > 0) {
        const deleteIds = sectionsToDelete.map((s) => s.id);
        console.log('Soft deleting IDs:', deleteIds);
        await manager.softDelete(AssessmentSection, deleteIds);
      }

      //if deleted the sections
      const clearExtistingSections: number[] =
        dto?.clear_existing_sections ?? [];
      if (clearExtistingSections.length > 0) {
        await manager.softDelete(AssessmentSection, {
          id: In(clearExtistingSections),
        });
      }

      //asd standards
      if (Array.isArray(standards) && standards.length > 0) {
        const assessmentStandardsEntities = standards.map((standardId) =>
          manager.create(AssessmentStandard, {
            assessment: { id: updatedAssessment.id },
            standard: { id: standardId },
            institution_id: null, // or set if you know it from standard
          }),
        );
        await manager.save(assessmentStandardsEntities);
      }
      return updatedAssessment;
    });
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }

  mappingQuestion(dto: addQuestionDto) {
    console.log('dto', dto);
    return this.dataSource.transaction(async (manager) => {
      const questionMapping = dto.question_mapping;
      const deleteMapping: number[] = questionMapping.reduce<number[]>(
        (prevData, data) => {
          const removeQuestionIds: number[] = (data.remove_questions_id ||
            []) as number[];
          return [...prevData, ...removeQuestionIds];
        },
        [],
      );

      if (deleteMapping.length > 0) {
        await manager.delete(SectionQuestion, deleteMapping);
      }

      const addQuestionsIds = questionMapping.reduce((prev, data) => {
        const qstIds = (data.question_ids || []) as number[];
        const buildQuestions = qstIds.map((qst_id) => ({
          assessmentSection: { id: data.section_id },
          question: { id: qst_id },
        }));
        return [...prev, ...buildQuestions];
      }, []);

      const mappingQuestions = addQuestionsIds.map((data) =>
        manager.create(SectionQuestion, data as any),
      );
      console.log(mappingQuestions);
      return await manager.save(SectionQuestion, mappingQuestions);
    });
  }

  getSectionQuestionsByAssessment(assmentId: number) {
    return this.assessmentsSectionRepo.find({
      where: {
        assessment: {
          id: assmentId,
        },
      },
      relations: ['sectionQuestions.question'],
    });
  }
}
