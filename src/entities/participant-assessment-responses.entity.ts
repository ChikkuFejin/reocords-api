import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ParticipantAssessmentAttempt } from './participant-assessment-attempts.entity';

@Entity({ name: 'participant_assessment_responses' })
export class ParticipantAssessmentResponse {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(
    () => ParticipantAssessmentAttempt,
    (attempt) => attempt.assessmentResponses,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'assessment_attempt_id' })
  assessmentAttempt: ParticipantAssessmentAttempt;

  @Column({ name: 'question_id', type: 'bigint', nullable: true })
  questionId: number;

  @Column({ name: 'entered_answers', type: 'text', nullable: true })
  enteredAnswers: string;

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect: boolean;

  @Column({
    name: 'point_awarded',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pointAwarded: number;

  @Column({
    name: 'negative_point',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  negativePoint: number;

  @Column({ name: 'options_ids', type: 'text', nullable: true })
  optionsIds: string;

  @Column({ name: 'started_at', type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ name: 'answered_at', type: 'datetime', nullable: true })
  answeredAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
