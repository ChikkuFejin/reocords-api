import { Module } from '@nestjs/common';
import { MentorsService } from './mentors.service';
import { MentorsController } from './mentors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from '../../entities/mentor.entity';
import { Institution } from '../../entities/institution.entity';
import { StandardSection } from '../../entities/standard-sections';
import { MentorStandardSection } from '../../entities/mentor-standard-section.entity';
import { MentorStandardSectionCategory } from '../../entities/mentor-standard-section-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mentor,
      Institution,
      StandardSection,
      MentorStandardSection,
      MentorStandardSectionCategory,
    ]),
  ],
  controllers: [MentorsController],
  providers: [MentorsService],
  exports: [MentorsService],
})
export class MentorsModule {}

