import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Mentor } from '../../entities/mentor.entity';
import { Institution } from '../../entities/institution.entity';
import { StandardSection } from '../../entities/standard-sections';
import { MentorStandardSection } from '../../entities/mentor-standard-section.entity';
import { MentorStandardSectionCategory } from '../../entities/mentor-standard-section-category.entity';
import { Category } from '../../entities/category.entity';
import {
  CreateMentorDto,
  MentorSectionEntryDto,
} from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { serviceResponse } from '../../helpers/response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MentorsService {
  private readonly mentorRelations = [
    'institution',
    'mentorStandardSections',
    'mentorStandardSections.standardSection',
    'mentorStandardSections.standardSection.standard',
    'mentorStandardSections.mentorStandardSectionCategories',
    'mentorStandardSections.mentorStandardSectionCategories.category',
  ];

  constructor(
    @InjectRepository(Mentor)
    private repo: Repository<Mentor>,
    @InjectRepository(Institution)
    private institutionRepo: Repository<Institution>,
    @InjectRepository(StandardSection)
    private standardSectionRepo: Repository<StandardSection>,
    @InjectRepository(MentorStandardSection)
    private mentorStandardSectionRepo: Repository<MentorStandardSection>,
    @InjectRepository(MentorStandardSectionCategory)
    private mentorStandardSectionCategoryRepo: Repository<MentorStandardSectionCategory>,
  ) {}

  async create(dto: CreateMentorDto): Promise<Mentor> {
    if (dto.institution_id) {
      const institution = await this.institutionRepo.findOne({
        where: { id: dto.institution_id },
      });
      if (!institution) {
        throw new BadRequestException(
          serviceResponse.notFoundError('Institution not found'),
        );
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const mentor = this.repo.create({
      name: dto.name,
      phone_number: dto.phone_number ?? undefined,
      username: dto.username,
      password: hashedPassword,
      is_active: dto.is_active ?? true,
      institution: dto.institution_id ? { id: dto.institution_id } : undefined,
    });

    const savedMentor: Mentor = await this.repo.save(mentor);

    if (dto.sections && dto.sections.length > 0) {
      await this.syncMentorSections(savedMentor, dto.sections);
    }

    return this.findOneOrFail(savedMentor.id);
  }

  async findAll(): Promise<Mentor[]> {
    return this.repo.find({
      where: {
        deleted_at: IsNull(),
      },
      relations: this.mentorRelations,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByInstitution(institutionId: number): Promise<Mentor[]> {
    const institution = await this.institutionRepo.findOne({
      where: { id: institutionId },
    });

    if (!institution) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Institution not found'),
      );
    }

    return this.repo.find({
      where: {
        institution: { id: institutionId },
        deleted_at: IsNull(),
      },
      relations: this.mentorRelations,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByStandard(standardId: number): Promise<Mentor[]> {
    const mentors = await this.repo
      .createQueryBuilder('mentor')
      .innerJoin('mentor.mentorStandardSections', 'mss')
      .innerJoin('mss.standardSection', 'ss')
      .innerJoin('ss.standard', 'standard')
      .leftJoinAndSelect('mentor.institution', 'institution')
      .leftJoinAndSelect('mentor.mentorStandardSections', 'relationsMss')
      .leftJoinAndSelect(
        'relationsMss.standardSection',
        'relationsStandardSection',
      )
      .leftJoinAndSelect(
        'relationsStandardSection.standard',
        'relationsStandard',
      )
      .leftJoinAndSelect(
        'relationsMss.mentorStandardSectionCategories',
        'relationsSectionCategories',
      )
      .leftJoinAndSelect(
        'relationsSectionCategories.category',
        'relationsCategory',
      )
      .where('standard.id = :standardId', { standardId })
      .andWhere('mentor.deleted_at IS NULL')
      .andWhere('ss.deletedAt IS NULL')
      .distinct(true)
      .getMany();

    return mentors;
  }

  async findOne(id: number): Promise<Mentor | null> {
    return this.repo.findOne({
      where: { id },
      relations: this.mentorRelations,
    });
  }

  async update(id: number, dto: UpdateMentorDto): Promise<Mentor> {
    const mentor = await this.repo.findOne({
      where: { id },
    });

    if (!mentor) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Mentor not found'),
      );
    }

    if (dto.institution_id !== undefined) {
      if (dto.institution_id) {
        const institution = await this.institutionRepo.findOne({
          where: { id: dto.institution_id },
        });
        if (!institution) {
          throw new BadRequestException(
            serviceResponse.notFoundError('Institution not found'),
          );
        }
        mentor.institution = { id: dto.institution_id } as Institution;
      } else {
        mentor.institution = undefined;
      }
    }

    if (dto.name !== undefined) {
      mentor.name = dto.name;
    }

    if (dto.phone_number !== undefined) {
      mentor.phone_number = dto.phone_number ?? undefined;
    }

    if (dto.username !== undefined) {
      mentor.username = dto.username;
    }

    if (dto.password !== undefined) {
      mentor.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.is_active !== undefined) {
      mentor.is_active = dto.is_active;
    }

    const updatedMentor: Mentor = await this.repo.save(mentor);

    if (dto.sections) {
      await this.syncMentorSections(updatedMentor, dto.sections);
    }

    return this.findOneOrFail(updatedMentor.id);
  }

  private async findOneOrFail(id: number): Promise<Mentor> {
    const mentor = await this.findOne(id);
    if (!mentor) {
      throw new BadRequestException(serviceResponse.notFoundError('Mentor not found'));
    }
    return mentor;
  }

  async remove(id: number): Promise<{ affected?: number }> {
    const mentor = await this.repo.findOne({
      where: { id },
    });

    if (!mentor) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Mentor not found'),
      );
    }

    return this.repo.softDelete(id);
  }

  private async syncMentorSections(
    mentor: Mentor,
    sections: MentorSectionEntryDto[],
  ) {
    await this.clearMentorSections(mentor.id);

    for (const section of sections) {
      const sectionId = Number(section.standard_section_id);
      if (Number.isNaN(sectionId) || sectionId <= 0) {
        continue;
      }

      const standardSection = await this.standardSectionRepo.findOne({
        where: { id: sectionId },
      });

      if (!standardSection) {
        throw new BadRequestException(
          serviceResponse.notFoundError(
            `Standard section ${sectionId} not found`,
          ),
        );
      }

      const mentorSection = this.mentorStandardSectionRepo.create({
        mentor: { id: mentor.id } as Mentor,
        standardSection: { id: sectionId } as StandardSection,
      });

      const savedMentorSection = await this.mentorStandardSectionRepo.save(
        mentorSection,
      );

      const categories = (section.categories || []).map((categoryId) =>
        Number(categoryId),
      );

      const validCategoryIds = categories.filter(
        (categoryId) => !Number.isNaN(categoryId) && categoryId > 0,
      );

      for (const categoryId of validCategoryIds) {
        const mentorSectionCategory =
          this.mentorStandardSectionCategoryRepo.create({
            mentorStandardSection: savedMentorSection,
            category: { id: categoryId } as Category,
          });
        await this.mentorStandardSectionCategoryRepo.save(
          mentorSectionCategory,
        );
      }
    }
  }

  private async clearMentorSections(mentorId: number) {
    const existingSections = await this.mentorStandardSectionRepo.find({
      where: { mentor: { id: mentorId } },
    });

    if (existingSections.length === 0) {
      return;
    }

    const sectionIds = existingSections.map((section) => section.id);

    await this.mentorStandardSectionCategoryRepo
      .createQueryBuilder()
      .delete()
      .where('mentor_standard_section_id IN (:...ids)', { ids: sectionIds })
      .execute();

    await this.mentorStandardSectionRepo
      .createQueryBuilder()
      .delete()
      .where('mentor_id = :mentorId', { mentorId })
      .execute();
  }
}

