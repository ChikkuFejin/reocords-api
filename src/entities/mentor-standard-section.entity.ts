import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Mentor } from './mentor.entity';
import { StandardSection } from './standard-sections';
import { MentorStandardSectionCategory } from './mentor-standard-section-category.entity';

@Entity({ name: 'mentor_standard_sections' })
@Index(['mentor', 'standardSection'], { unique: true })
export class MentorStandardSection {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorStandardSections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor: Mentor;

  @ManyToOne(() => StandardSection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'standard_section_id' })
  standardSection: StandardSection;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(
    () => MentorStandardSectionCategory,
    (mentorStandardSectionCategory) =>
      mentorStandardSectionCategory.mentorStandardSection,
  )
  mentorStandardSectionCategories?: MentorStandardSectionCategory[];
}

