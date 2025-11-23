import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Assessment } from './assessment.entity';
import { Participant } from './participants.entity';

@Entity({ name: 'participant_assessments' })
export class ParticipantAssessment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(
    () => Assessment,
    (assessment) => assessment.participantAssessments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(
    () => Participant,
    (participant) => participant.participantAssessments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;
}
