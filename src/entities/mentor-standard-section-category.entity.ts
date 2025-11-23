import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MentorStandardSection } from './mentor-standard-section.entity';
import { Category } from './category.entity';

@Entity({ name: 'mentor_standard_section_category' })
@Index(['mentorStandardSection', 'category'], { unique: true })
export class MentorStandardSectionCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(
    () => MentorStandardSection,
    (mentorStandardSection) =>
      mentorStandardSection.mentorStandardSectionCategories,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'mentor_standard_section_id' })
  mentorStandardSection: MentorStandardSection;

  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}

