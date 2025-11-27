import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, DeleteResult } from 'typeorm';
import { Institution } from '../../entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { UserService } from '../users/user.service';
import { CreateInstitutionUserDto } from './dto/create-institution-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private institutionRepository: Repository<Institution>,
    private userService: UserService,
  ) { }

  async create(payload: CreateInstitutionDto): Promise<Institution> {
    const entity = this.institutionRepository.create(payload as DeepPartial<Institution>);
    return await this.institutionRepository.save(entity);
  }

  async findAll() {
    return await this.institutionRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    return await this.institutionRepository.findOne({ where: { id: Number(id) } });
  }

  async update(id: number, payload: UpdateInstitutionDto) {
    return await this.institutionRepository.update({ id: Number(id) }, payload as any);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.institutionRepository.delete(id);
  }

  async createUser(institutionId: number, payload: CreateInstitutionUserDto) {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(payload.password, salt);

    return this.userService.create({
      ...payload,
      institution_id: institutionId,
      password_hash,
    });
  }
}
