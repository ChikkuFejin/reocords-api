import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AssessmentSection } from './assessment-section.entity';
import { Question } from './question.entity';

@Entity({ name: 'section_questions' })
export class SectionQuestion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => AssessmentSection, (section) => section.sectionQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_section_id' })
  assessmentSection: AssessmentSection;

  @ManyToOne(() => Question, (question) => question.sectionQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
