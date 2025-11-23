import { Injectable } from '@nestjs/common';
import { CreateQuestionTypeDto } from './dto/create-question-type.dto';
import { UpdateQuestionTypeDto } from './dto/update-question-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionType } from '../../entities/question-type.entity';

@Injectable()
export class QuestionTypeService {
  constructor(
    @InjectRepository(QuestionType)
    private questionTypeRepository: Repository<QuestionType>,
  ) {}
  create(createQuestionTypeDto: CreateQuestionTypeDto) {
    const newQuestionType = this.questionTypeRepository.create(
      createQuestionTypeDto,
    );
    return this.questionTypeRepository.save(newQuestionType);
  }

  findAll() {
    return this.questionTypeRepository.find();
  }

  findOne(id: number) {
    return this.questionTypeRepository.findOne({ where: { id } });
  }

  update(id: number, updateQuestionTypeDto: CreateQuestionTypeDto) {
    return this.questionTypeRepository.update(id, updateQuestionTypeDto);
  }

  remove(id: number) {
    return this.questionTypeRepository.softDelete(id);
  }
}
