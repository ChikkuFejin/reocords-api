import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Participant } from './participants.entity';
import { StandardSection } from './standard-sections';

// Represents participants_standard_sections table
@Entity({ name: 'participants_standard_sections' })
export class ParticipantStandardSection {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Participant, (participant) => participant.participantStandardSections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;

  @ManyToOne(() => StandardSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'standard_section_id' })
  standardSection: StandardSection;
}
