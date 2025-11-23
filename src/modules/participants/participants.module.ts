import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from '../../entities/participants.entity';
import { Institution } from '../../entities/institution.entity';
import { StandardSection } from '../../entities/standard-sections';
import { ParticipantStandardSection } from '../../entities/participant-standard-sections.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participant,
      Institution,
      StandardSection,
      ParticipantStandardSection,
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}

