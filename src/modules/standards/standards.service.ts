import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateStandardDto,
  standardSectionDto,
  UpdateStandardDto,
} from './dto/standards.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Standard } from '../../entities/standard.entity';
import { serviceResponse } from '../../helpers/response';
import { StandardSection } from '../../entities/standard-sections';
import { Category } from '../../entities/category.entity';

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard)
    private repo: Repository<Standard>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  create(dto: CreateStandardDto, institution_id: number|null = null) {
    const data = this.repo.create({
      ...dto,
      institution: institution_id ? { id: institution_id } : undefined,
    });
    return this.repo.save(data);
  }

  findAll(institution_id: number|null = null) {
    return this.repo.find({
      where: {
        institution: institution_id ? { id: institution_id } : IsNull(),
      },
      relations: ['categories', 'standardSections'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['categories', 'standardSections'],
    });
  }

  update(id: number, dto: UpdateStandardDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }

  async findByInstitution(institution_id: number) {
    return this.repo.find({
      where: {
        institution: { id: institution_id },
        deleted_at: IsNull(),
      },
      relations: ['standardSections', 'categories'],
      withDeleted: true,
    });
  }

  async standardSection(
    dto: standardSectionDto,
    institutionId: number | null = null,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const { standard, sections } = dto;

      let standardEntity: Standard | null;

      if (standard.id) {
        standardEntity = await manager.findOne(Standard, {
          where: { id: standard.id },
          relations: ['standardSections'], // Removed 'categories' since category handling is disabled
        });

        if (!standardEntity)
          throw new BadRequestException(serviceResponse.notFoundError());

        standardEntity.name = standard.name;
        standardEntity.description = standard.description as string;
        standardEntity.is_active = standard.is_active ?? true;

        // DISABLED: Category handling for /standards/add-standard-section endpoint
        // Categories are not being sent in the request, so this code is commented out
        // If categories array is provided (even if empty), update the categories
        // if (standard.categories !== undefined) {
        //   // Get existing categories
        //   const existingCategories = standardEntity.categories || [];
        //   const categoryIdsToKeep = standard.categories.map((id) => Number(id));
        //   
        //   // Find categories to remove (existing but not in new list)
        //   const categoriesToRemove = existingCategories.filter(
        //     (cat) => !categoryIdsToKeep.includes(Number(cat.id)),
        //   );

        //   // Remove categories that are no longer associated
        //   if (categoriesToRemove.length > 0) {
        //     await manager
        //       .createQueryBuilder()
        //       .update(Category)
        //       .set({ standard: null })
        //       .where('id IN (:...ids)', { ids: categoriesToRemove.map((cat) => cat.id) })
        //       .execute();
        //   }

        //   // Add or update categories
        //   if (categoryIdsToKeep.length > 0) {
        //     const categoryEntities = await Promise.all(
        //       categoryIdsToKeep.map(async (catId) => {
        //         const existing = await manager.findOne(Category, {
        //           where: { id: catId },
        //         });
        //         if (existing && standardEntity) {
        //           existing.standard = standardEntity;
        //           // Save the category with the updated standard reference
        //           await manager.save(Category, existing);
        //           return existing;
        //         }
        //         return null;
        //       }),
        //     );
        //     standardEntity.categories = categoryEntities.filter(
        //       (cat): cat is Category => cat !== null,
        //     );
        //   } else {
        //     // Empty array means remove all categories
        //     standardEntity.categories = [];
        //   }
        // }
      } else {
        const newData = {
          ...standard,
        } as CreateStandardDto;
        if (institutionId) {
          newData['institution'] = { id: institutionId };
        }
        standardEntity = manager.create(Standard, newData);
        
        // Save the standard first to get its ID (required for sections to reference it)
        standardEntity = await manager.save(Standard, standardEntity);

        // DISABLED: Category handling for /standards/add-standard-section endpoint
        // Categories are not being sent in the request, so this code is commented out
        // Handle categories for new standard
        // if (standard.categories && standard.categories.length > 0 && standardEntity) {
        //   const categoryEntities = await Promise.all(
        //     standard.categories.map(async (catId) => {
        //       const category = await manager.findOne(Category, {
        //         where: { id: Number(catId) },
        //       });
        //       if (category && standardEntity) {
        //         category.standard = standardEntity;
        //         // Save the category with the updated standard reference
        //         await manager.save(Category, category);
        //         return category;
        //       }
        //       return null;
        //     }),
        //   );
        //   standardEntity.categories = categoryEntities.filter(
        //     (cat): cat is Category => cat !== null,
        //   );
        // }
      }

      // Prepare sections for create/update (without categories)
      const sectionEntities = await Promise.all(
        sections.map(async (s) => {
          let sectionEntity: StandardSection | null;

          if (s.id) {
            sectionEntity = await manager.findOne(StandardSection, {
              where: { id: s.id },
              relations: ['standard'],
            });

            if (sectionEntity) {
              sectionEntity.name = s.name;
              sectionEntity.isActive = s.is_active ?? sectionEntity.isActive;
              sectionEntity.standard = standardEntity; // Ensure standard is set
              // Save the updated section
              return await manager.save(StandardSection, sectionEntity);
            }
          }

          // Create new section if no ID or not found
          // Now standardEntity has an ID, so standard_id will be set correctly
          const newSection = manager.create(StandardSection, {
            name: s.name,
            isActive: s.is_active ?? true,
            standard: standardEntity, // This will set standard_id correctly now that standard has an ID
          } as any);
          // Save the new section
          return await manager.save(StandardSection, newSection);
        }),
      );

      // Set sections on standard entity
      standardEntity.standardSections = sectionEntities;

      // Save everything - this will save the standard with its sections
      return await manager.save(Standard, standardEntity);
    });
  }

  // New helper APIs
  async getSectionsByStandard(standardId: number) {
    return this.repo.findOne({
      where: { id: Number(standardId) },
      relations: ['standardSections', 'categories'],
    });
  }

  async getCategoriesByStandard(standardId: number) {
    return this.repo.findOne({
      where: { id: Number(standardId) },
      relations: ['categories'],
    });
  }
}
