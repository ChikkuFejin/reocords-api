import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Institution } from './institution.entity';
import { MentorStandardSection } from './mentor-standard-section.entity';

@Entity({ name: 'mentors' })
export class Mentor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Institution, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'institution_id' })
  institution?: Institution;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number?: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(
    () => MentorStandardSection,
    (mentorStandardSection) => mentorStandardSection.mentor,
  )
  mentorStandardSections?: MentorStandardSection[];
}

