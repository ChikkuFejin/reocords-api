import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_media')
export class QuestionMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['image', 'video', 'audio', 'document'] })
  type: string;

  @Column()
  path: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
