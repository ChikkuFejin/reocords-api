import { Injectable } from '@nestjs/common';
import { CreateTopicsDto, UpdateTopicsDto } from './dto/topics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../../entities/topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private repo: Repository<Topic>,
  ) {}
  create(dto: CreateTopicsDto) {
    const data = this.repo.create(dto);
    return this.repo.save(data);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateTopicsDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
