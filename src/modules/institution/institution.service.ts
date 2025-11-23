import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Institution } from '../../entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
      @InjectRepository(Institution)
    private readonly repo: Repository<Institution>,
  ) {}

  async create(payload: CreateInstitutionDto): Promise<Institution> {
    const entity = this.repo.create(payload as DeepPartial<Institution>);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id: Number(id) } });
  }

  async update(id: number, payload: UpdateInstitutionDto) {
    return await this.repo.update({ id: Number(id) }, payload as any);
  }

  async remove(id: number) {
    return await this.repo.softDelete({ id: Number(id) });
  }
}
