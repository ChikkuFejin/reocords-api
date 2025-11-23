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
import { AssessmentStandard } from './assessment_standard.entity';
import { StandardSection } from './standard-sections';
import { Category } from './category.entity';

@Entity({ name: 'standards' })
export class Standard {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
  //
  // @Column({ type: 'bigint', nullable: true })
  // institution_id?: number;

  @ManyToOne(() => Institution, (institution) => institution.standards, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'institution_id' })
  institution?: Institution;
  @OneToMany(() => Category, (category) => category.standard, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
  })
  categories?: Category[];

  @OneToMany(
    () => AssessmentStandard,
    (assessmentStandard) => assessmentStandard.standard,
  )
  assessmentStandards: AssessmentStandard[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(
    () => StandardSection,
    (standardSection) => standardSection.standard,
    {
      eager: true,
      onDelete: 'SET NULL',
      cascade: true,
    },
  )
  standardSections: StandardSection[];
}
