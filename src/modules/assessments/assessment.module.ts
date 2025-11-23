import { Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AssessmentController } from './assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from '../../entities/assessment.entity';
import { AssessmentSection } from '../../entities/assessment-section.entity';
import { AssessmentInstruction } from '../../entities/assessment-instruction.entity';
import { AssessmentStandard } from '../../entities/assessment_standard.entity';
import { Standard } from '../../entities/standard.entity';
import { Institution } from '../../entities/institution.entity';
import { SectionQuestion } from '../../entities/section-questions.entity';
import { Participant } from '../../entities/participants.entity';
import { ParticipantAssessment } from '../../entities/participant-assessments.entity';
import { ParticipantAssessmentResponse } from '../../entities/participant-assessment-responses.entity';
import { ParticipantAssessmentAttempt } from '../../entities/participant-assessment-attempts.entity';
import { StandardSection } from '../../entities/standard-sections';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      AssessmentSection,
      AssessmentInstruction,
      AssessmentStandard,
      Standard,
      Institution,
      SectionQuestion,
      Participant,
      ParticipantAssessment,
      ParticipantAssessmentResponse,
      ParticipantAssessmentAttempt,
      StandardSection,
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentsService],
})
export class AssessmentModule {}
