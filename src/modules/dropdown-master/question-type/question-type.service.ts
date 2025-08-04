import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionType } from '../../../entities/question-type.entity';
import { Repository } from 'typeorm';
import { serviceResponse } from '../../../helpers/response';

@Injectable()
export class QuestionTypeService {
  constructor(
    @InjectRepository(QuestionType)
    private questionTypeRepo: Repository<QuestionType>,
  ) {}
  getAll() {
    const data = this.questionTypeRepo.find({});
    return serviceResponse.success(data);
  }
  // getOne(data) {}
  // create(data) {}
  // update(data) {}
  // remove(data) {}
}
