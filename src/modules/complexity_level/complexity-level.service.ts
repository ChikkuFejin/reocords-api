import { Injectable } from '@nestjs/common';
import { CreateComplexityLevelDto } from './dto/create-complexity-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplexityLevel } from '../../entities/complexity-levels.entity';

@Injectable()
export class ComplexityLevelService {
  constructor(
    @InjectRepository(ComplexityLevel)
    private repo: Repository<ComplexityLevel>,
  ) {}
  create(createQuestionTypeDto: CreateComplexityLevelDto) {
    const data = this.repo.create(createQuestionTypeDto);
    return this.repo.save(data);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, updateQuestionTypeDto: CreateComplexityLevelDto) {
    return this.repo.update(id, updateQuestionTypeDto);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
