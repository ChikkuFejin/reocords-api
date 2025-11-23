import { Module } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { QuestionBankController } from './question-bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionMedia } from '../../entities/question-media.entity';
import { McqOption } from '../../entities/mcq-option.entity';
import { McqOptionMedia } from '../../entities/mcq-option-media.entity';
import { QuestionExplanation } from '../../entities/question-explanations.entity';
import { QuestionExplanationMedia } from '../../entities/question-explanation-media.entity';
import { SectionQuestion } from '../../entities/section-questions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      QuestionMedia,
      McqOption,
      McqOptionMedia,
      QuestionExplanation,
      QuestionExplanationMedia,
      SectionQuestion,
    ]),
  ],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
})
export class QuestionBankModule {}
