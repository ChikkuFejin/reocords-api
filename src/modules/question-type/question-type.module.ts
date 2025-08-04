import { Module } from '@nestjs/common';
import { QuestionTypeService } from './question-type.service';
import { QuestionTypeController } from './question-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionType } from '../../entities/question-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionType])],
  controllers: [QuestionTypeController],
  providers: [QuestionTypeService],
  exports: [QuestionTypeService],
})
export class QuestionTypeModule {}
