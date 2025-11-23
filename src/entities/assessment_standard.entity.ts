import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Standard } from './standard.entity';
import { Institution } from './institution.entity';

@Entity({ name: 'assessment_standards' })
export class AssessmentStandard {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Assessment, (assessment) => assessment.assessmentStandards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => Standard, (standard) => standard.assessmentStandards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'standard_id' })
  standard: Standard;

  @ManyToOne(() => Institution, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'institution_id' })
  institution?: Institution;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
