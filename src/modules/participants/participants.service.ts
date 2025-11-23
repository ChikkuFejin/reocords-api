import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Participant } from '../../entities/participants.entity';
import { Institution } from '../../entities/institution.entity';
import { StandardSection } from '../../entities/standard-sections';
import { ParticipantStandardSection } from '../../entities/participant-standard-sections.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { serviceResponse } from '../../helpers/response';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
    @InjectRepository(Institution)
    private institutionRepo: Repository<Institution>,
    @InjectRepository(StandardSection)
    private standardSectionRepo: Repository<StandardSection>,
    @InjectRepository(ParticipantStandardSection)
    private mapRepo: Repository<ParticipantStandardSection>,
  ) {}

  async create(dto: CreateParticipantDto): Promise<Participant> {
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

    const standardSection = await this.standardSectionRepo.findOne({
      where: { id: dto.standard_id },
    });
    if (!standardSection) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Standard section not found'),
      );
    }

    const participant = this.participantRepo.create({
      name: dto.name,
      rollNumber: dto.roll_number ?? null,
      passwordHash: dto.password_hash,
      email: dto.email ?? null,
      phoneNumber: dto.phone_number ?? null,
      standardId: dto.standard_id,
      institution: dto.institution_id ? { id: dto.institution_id } : null,
    } as any);

    const savedParticipant = await this.participantRepo.save(participant);
    const participantId = Array.isArray(savedParticipant) 
      ? (savedParticipant[0] as Participant).id 
      : (savedParticipant as Participant).id;

    const sectionIds = dto.standard_section_ids ?? [];
    if (sectionIds.length > 0) {
      const mappings = sectionIds.map((sid) =>
        this.mapRepo.create({
          participant: { id: participantId } as any,
          standardSection: { id: sid } as any,
        }),
      );
      await this.mapRepo.save(mappings);
    }

    return this.findOneOrFail(participantId);
  }

  async findAll(): Promise<Participant[]> {
    return this.participantRepo.find({
      where: { deletedAt: IsNull() },
      relations: [
        'institution',
        'participantStandardSections',
        'participantStandardSections.standardSection',
        'participantStandardSections.standardSection.standard',
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Participant | null> {
    return this.participantRepo.findOne({
      where: { id: Number(id), deletedAt: IsNull() },
      relations: [
        'institution',
        'participantStandardSections',
        'participantStandardSections.standardSection',
        'participantStandardSections.standardSection.standard',
      ],
    });
  }

  async findByStandard(standardId: number): Promise<Participant[]> {
    return this.participantRepo.find({
      where: { standardId: Number(standardId), deletedAt: IsNull() },
      relations: [
        'institution',
        'participantStandardSections',
        'participantStandardSections.standardSection',
        'participantStandardSections.standardSection.standard',
      ],
      order: { id: 'DESC' },
    });
  }

  private async findOneOrFail(id: number): Promise<Participant> {
    const participant = await this.participantRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: [
        'institution',
        'participantStandardSections',
        'participantStandardSections.standardSection',
        'participantStandardSections.standardSection.standard',
      ],
    });

    if (!participant) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Participant not found'),
      );
    }

    return participant;
  }

  async update(id: number, dto: UpdateParticipantDto): Promise<Participant> {
    const participant = await this.participantRepo.findOne({
      where: { id: Number(id) },
    });

    if (!participant) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Participant not found'),
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
        participant.institution = { id: dto.institution_id } as Institution;
      } else {
        participant.institution = null;
      }
    }

    if (dto.name !== undefined) {
      participant.name = dto.name;
    }

    if (dto.roll_number !== undefined) {
      participant.rollNumber = dto.roll_number ?? null;
    }

    if (dto.password_hash !== undefined) {
      participant.passwordHash = dto.password_hash;
    }

    if (dto.email !== undefined) {
      participant.email = dto.email ?? null;
    }

    if (dto.phone_number !== undefined) {
      participant.phoneNumber = dto.phone_number ?? null;
    }

    if (dto.standard_id !== undefined) {
      const standardSection = await this.standardSectionRepo.findOne({
        where: { id: dto.standard_id },
      });
      if (!standardSection) {
        throw new BadRequestException(
          serviceResponse.notFoundError('Standard section not found'),
        );
      }
      participant.standardId = dto.standard_id;
    }

    await this.participantRepo.save(participant);

    if (dto.standard_section_ids !== undefined) {
      await this.mapRepo.delete({ participant: { id: Number(id) } as any });

      if (dto.standard_section_ids.length > 0) {
        const mappings = dto.standard_section_ids.map((sid) =>
          this.mapRepo.create({
            participant: { id: Number(id) } as any,
            standardSection: { id: sid } as any,
          }),
        );
        await this.mapRepo.save(mappings);
      }
    }

    return this.findOneOrFail(Number(id));
  }

  async remove(id: number): Promise<{ affected?: number }> {
    const participant = await this.participantRepo.findOne({
      where: { id },
    });

    if (!participant) {
      throw new BadRequestException(
        serviceResponse.notFoundError('Participant not found'),
      );
    }

    await this.mapRepo.delete({ participant: { id: Number(id) } as any });

    return this.participantRepo.softDelete(id);
  }
}

