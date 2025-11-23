import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { StandardSection } from '../../entities/standard-sections';
import { Standard } from '../../entities/standard.entity';
import { serviceResponse } from '../../helpers/response';
import { CreateStandardSectionDto } from './dto/create-standard-section.dto';
import { UpdateStandardSectionDto } from './dto/update-standard-section.dto';

@Injectable()
export class StandardSectionsService {
  constructor(
    @InjectRepository(StandardSection)
    private repo: Repository<StandardSection>,
    @InjectRepository(Standard)
    private standardRepo: Repository<Standard>,
  ) {}

  async create(dto: CreateStandardSectionDto): Promise<StandardSection> {
    // Verify that the standard exists
    const standard = await this.standardRepo.findOne({
      where: { id: dto.standard_id },
    });

    if (!standard) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Standard not found'),
      );
    }

    const section = this.repo.create({
      name: dto.name,
      isActive: dto.is_active ?? true,
      standard: { id: dto.standard_id } as Standard,
    });

    return this.repo.save(section);
  }

  async findAll(): Promise<StandardSection[]> {
    return this.repo.find({
      where: {
        deletedAt: IsNull(),
      },
      relations: ['standard'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByStandard(standardId: number): Promise<StandardSection[]> {
    // Verify that the standard exists
    const standard = await this.standardRepo.findOne({
      where: { id: standardId },
    });

    if (!standard) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Standard not found'),
      );
    }

    return this.repo.find({
      where: {
        standard: { id: standardId },
        deletedAt: IsNull(),
      },
      relations: ['standard'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<StandardSection | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['standard'],
    });
  }

  async update(
    id: number,
    dto: UpdateStandardSectionDto,
  ): Promise<StandardSection> {
    const section = await this.repo.findOne({
      where: { id },
    });

    if (!section) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Section not found'),
      );
    }

    // If standard_id is being updated, verify the standard exists
    if (dto.standard_id) {
      const standard = await this.standardRepo.findOne({
        where: { id: dto.standard_id },
      });

      if (!standard) {
        throw new BadRequestException(
          serviceResponse.notFoundError('Standard not found'),
        );
      }

      section.standard = { id: dto.standard_id } as Standard;
    }

    // Update other fields
    if (dto.name !== undefined) {
      section.name = dto.name;
    }

    if (dto.is_active !== undefined) {
      section.isActive = dto.is_active;
    }

    return this.repo.save(section);
  }

  async remove(id: number): Promise<{ affected?: number }> {
    const section = await this.repo.findOne({
      where: { id },
    });

    if (!section) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Section not found'),
      );
    }

    return this.repo.softDelete(id);
  }
}

