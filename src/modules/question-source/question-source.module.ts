import { Module } from '@nestjs/common';
import { QuestionSourceService } from './question-source.service';
import { QuestionSourceController } from './question-source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSource } from '../../entities/question-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSource])],
  controllers: [QuestionSourceController],
  providers: [QuestionSourceService],
  exports: [QuestionSourceService],
})
export class QuestionSourceModule {}
