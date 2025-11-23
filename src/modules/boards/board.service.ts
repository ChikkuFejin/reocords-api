import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
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

  update(id: number, dto: UpdateBoardDto) {
    // Only update fields that are provided (not undefined)
    const updateData: Partial<Board> = {};
    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    return this.repo.update(id, updateData);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
