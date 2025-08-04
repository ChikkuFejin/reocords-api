import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { McqOption } from './mcq-option.entity';

@Entity('mcq_option_media')
export class McqOptionMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['image', 'video', 'audio', 'document'] })
  type: string;

  @Column()
  path: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => McqOption)
  @JoinColumn({ name: 'mcq_option_id' })
  mcq_option: McqOption;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
