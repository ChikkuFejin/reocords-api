import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { SectionQuestion } from './section-questions.entity';
import { AssessmentStandard } from './assessment_standard.entity';

export enum AssessmentSectionStatus {
  DRAFT = 'draft',
  PUBLISH = 'publish',
}

@Entity('assessment_sections')
export class AssessmentSection {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  // @Column({ type: 'bigint' })
  // assessment_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  total_question_count: number;

  @Column({ type: 'double', default: 0 })
  positive_mark: number;

  @Column({ type: 'double', default: 0 })
  negative_mark: number;

  @Column({ type: 'int', nullable: true })
  total_duration_minutes: number | null;

  @Column({ type: 'enum', enum: ['draft', 'publish'], default: 'draft' })
  status: 'draft' | 'publish';

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // 🔗 Relationship with Assessment
  @ManyToOne(() => Assessment, (assessment) => assessment.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @OneToMany(
    () => SectionQuestion,
    (sectionQuestion) => sectionQuestion.assessmentSection,
  )
  sectionQuestions: SectionQuestion[];
}
