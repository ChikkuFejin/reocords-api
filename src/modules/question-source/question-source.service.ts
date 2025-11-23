import { Injectable } from '@nestjs/common';
import { CreateQuestionSourceDto } from './dto/create-question-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionSource } from '../../entities/question-source.entity';

@Injectable()
export class QuestionSourceService {
  constructor(
    @InjectRepository(QuestionSource)
    private repo: Repository<QuestionSource>,
  ) {}
  create(createQuestionTypeDto: CreateQuestionSourceDto) {
    const data = this.repo.create(createQuestionTypeDto);
    return this.repo.save(data);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, updateQuestionTypeDto: CreateQuestionSourceDto) {
    return this.repo.update(id, updateQuestionTypeDto);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
