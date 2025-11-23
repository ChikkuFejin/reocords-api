import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Topic } from './topic.entity';
import { Board } from './boards.entity';
import { AssessmentInstruction } from './assessment-instruction.entity';
import { AssessmentSection } from './assessment-section.entity';
import { Category } from './category.entity';
import { AssessmentStandard } from './assessment_standard.entity';
import { Standard } from './standard.entity';
import { ParticipantAssessmentAttempt } from './participant-assessment-attempts.entity';
import { ParticipantAssessment } from './participant-assessments.entity';

export enum AssessmentType {
  PREBUILD = 'prebuild',
  SCHEDULE = 'schedule',
}

export enum QuestionPickType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @Column({ type: 'bigint' })
  // category_id: number;
  //
  // @Column({ type: 'bigint' })
  // topic_id: number;

  @Column({ type: 'double' })
  total_marks: number;

  @Column({ type: 'varchar', length: 50 })
  examination_duration_minutes: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  examination_code: string;

  @Column({ type: 'enum', enum: AssessmentType })
  type: AssessmentType;

  @Column({ type: 'timestamp', nullable: true })
  schedule_date: Date;

  @Column({ type: 'boolean', default: false })
  is_question_timed: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  question_time_seconds: string;

  @Column({ type: 'enum', enum: QuestionPickType })
  question_pick: QuestionPickType;

  @Column({ type: 'boolean', default: false })
  is_homework: boolean;

  @Column({ type: 'boolean', default: false })
  is_question_shuffle: boolean;

  @Column({ type: 'boolean', default: false })
  is_display_result: boolean;

  @Column({ type: 'int', nullable: true })
  reminder_time_to_end_seconds: number;

  @Column({ type: 'varchar', length: 255 })
  created_by: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reviewed_by: string;

  // @Column({ type: 'int' })
  // board_id: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // --- Relationships ---
  @ManyToOne(() => Category, (category) => category.assessments, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Topic, (topic) => topic.assessments, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @ManyToOne(() => Board, (board) => board.assessments, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToOne(() => AssessmentInstruction, (assessment) => assessment.assessment)
  instructions: AssessmentInstruction;

  @OneToMany(
    () => AssessmentSection,
    (assessmentSection) => assessmentSection.assessment,
    {
      cascade: true, //to automatic create
      // eager: true, // to auto-fetch sections
    },
  )
  sections: AssessmentSection[];

  @OneToMany(
    () => AssessmentStandard,
    (assessmentStandard) => assessmentStandard.assessment,
  )
  assessmentStandards: AssessmentStandard[];

  @OneToMany(
    () => ParticipantAssessmentAttempt,
    (participantAssessmentAttempt) => participantAssessmentAttempt.assessment,
  )
  participantAssessmentAttempts: AssessmentSection[];

  @OneToMany(
    () => ParticipantAssessment,
    (participantAssessment) => participantAssessment.assessment,
  )
  participantAssessments: AssessmentSection[];
}
