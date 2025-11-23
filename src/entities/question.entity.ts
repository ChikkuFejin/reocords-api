import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionType } from './question-type.entity';
import { Category } from './category.entity';
import { QuestionSource } from './question-source.entity';
import { ComplexityLevel } from './complexity-levels.entity';
import { Board } from './boards.entity';
import { QuestionMedia } from './question-media.entity';
import { McqOption } from './mcq-option.entity';
import { QuestionExplanation } from './question-explanations.entity';
import { SectionQuestion } from './section-questions.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @OneToOne(() => QuestionType)
  @JoinColumn({ name: 'question_type_id' })
  questionType: QuestionType;

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToOne(() => QuestionSource)
  @JoinColumn({ name: 'source_id' })
  source: QuestionSource;

  @Column('double')
  mark: number;

  @Column()
  answerable_time_seconds: number;

  @OneToOne(() => ComplexityLevel)
  @JoinColumn({ name: 'complexity_level_id' })
  complexityLevel: ComplexityLevel;

  @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  mcq_selection: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verified_by?: string;

  @Column({ type: 'enum', enum: ['draft', 'publish'], default: 'draft' })
  status: 'draft' | 'publish';

  @Column({ type: 'enum', enum: ['AI', 'MANUAL'], nullable: true })
  evaluation_method: 'AI' | 'MANUAL';

  @OneToOne(() => Board)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => QuestionMedia, (media) => media.question, { cascade: true })
  question_media: QuestionMedia[];

  @OneToMany(() => McqOption, (option) => option.question, { cascade: true })
  mcq_options: McqOption[];

  @OneToOne(() => QuestionExplanation, (explanation) => explanation.question, {
    cascade: true,
  })
  explanation: QuestionExplanation;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => SectionQuestion,
    (sectionQuestion) => sectionQuestion.assessmentSection,
  )
  sectionQuestions: SectionQuestion[];
}
