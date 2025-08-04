import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../../entities/boards.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private repo: Repository<Board>,
  ) {}
  create(dto: CreateBoardDto) {
    const data = this.repo.create(dto);
    return this.repo.save(data);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, dto: CreateBoardDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
