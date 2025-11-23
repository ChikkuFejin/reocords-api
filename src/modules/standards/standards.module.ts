import { Module } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsController } from './standards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Standard } from '../../entities/standard.entity';
import { Assessment } from '../../entities/assessment.entity';
import { AssessmentStandard } from '../../entities/assessment_standard.entity';
import { Institution } from '../../entities/institution.entity';
import { StandardSection } from '../../entities/standard-sections';
import { Category } from '../../entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      Standard,
      AssessmentStandard,
      Institution,
      StandardSection,
      Category,
    ]),
  ],
  controllers: [StandardsController],
  providers: [StandardsService],
  exports: [StandardsService],
})
export class StandardsModule {}
