import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { QuestionExplanationMedia } from './question-explanation-media.entity';

@Entity('question_explanations')
export class QuestionExplanation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column('text')
  explanation: string;

  @Column({ nullable: true })
  answer_keywords: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => QuestionExplanationMedia,
    (option) => option.question_explanation,
    { cascade: true },
  )
  explanation_media: QuestionExplanationMedia;
}
