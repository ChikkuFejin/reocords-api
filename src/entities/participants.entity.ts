import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Institution } from './institution.entity';
import { ParticipantAssessment } from './participant-assessments.entity';
import { ParticipantStandardSection } from './participant-standard-sections.entity';

@Entity({ name: 'participants' })
export class Participant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Institution, (institution) => institution.participants, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'roll_number', type: 'varchar', length: 100, nullable: true })
  rollNumber: string | null;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({ name: 'standard_id', type: 'bigint' })
  standardId: number;

  @OneToMany(() => ParticipantStandardSection, (pss) => pss.participant)
  participantStandardSections: ParticipantStandardSection[];

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ParticipantAssessment, (pa) => pa.participant)
  participantAssessments: ParticipantAssessment[];
}
