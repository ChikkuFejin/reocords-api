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
import { ParticipantAssessmentResponse } from './participant-assessment-responses.entity';

@Entity({ name: 'participant_assessment_attempts' })
export class ParticipantAssessmentAttempt {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(
    () => Assessment,
    (assessment) => assessment.participantAssessmentAttempts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ name: 'finish_time', type: 'datetime', nullable: true })
  finishTime: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  score: string;

  @Column({
    type: 'enum',
    enum: ['in_process', 'submitted', 'graded'],
    nullable: true,
  })
  status: 'in_process' | 'submitted' | 'graded';

  @Column({ name: 'verified_by', type: 'varchar', length: 255, nullable: true })
  verifiedBy: string;

  @Column({ name: 'verified_comments', type: 'text', nullable: true })
  verifiedComments: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => ParticipantAssessmentResponse,
    (response) => response.assessmentAttempt,
  )
  assessmentResponses: ParticipantAssessmentResponse[];
}
