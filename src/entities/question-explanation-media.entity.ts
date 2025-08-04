import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionExplanation } from './question-explanations.entity';

@Entity('question_explanation_media')
export class QuestionExplanationMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['image', 'video', 'audio', 'document'] })
  type: string;

  @Column()
  path: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => QuestionExplanation)
  @JoinColumn({ name: 'question_explanation_id' })
  question_explanation: QuestionExplanation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
