import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto, parent: Category | null = null) {
    const category: any = this.categoryRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      is_active: createCategoryDto.is_active ?? true,
      standard: createCategoryDto.standard_id
        ? { id: createCategoryDto.standard_id }
        : null,
      parent: parent ? parent : null,
    } as any);
    // category.name = createCategoryDto.name;
    // category.description = createCategoryDto.description;
    // category.is_active = createCategoryDto.is_active ?? true;
    // category.standard = createCategoryDto.standard_id
    //   ? { id: createCategoryDto.standard_id }
    //   : null;
    // if (parent) {
    //   category.parent = parent;
    // }
    return this.categoryRepository.save(category);
  }

  findAll() {
    console.log('findAll');
    return this.categoryRepository.find({
      where: { deleted_at: IsNull(), parent: IsNull() },
      relations: ['children'],
    });
  }

  findByStandard(standardId: number) {
    return this.categoryRepository.find({
      where: {
        standard: { id: standardId },
        deleted_at: IsNull(),
      },
      relations: ['children', 'standard'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['children'],
    });
  }

  update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    parent: Category | null = null,
  ) {
    let data = {
      name: updateCategoryDto.name,
      description: updateCategoryDto.description,
      is_active: updateCategoryDto.is_active,
      standard: updateCategoryDto.standard_id
        ? { id: updateCategoryDto.standard_id }
        : null,
    };
    if (parent) {
      data['parent'] = parent;
    }
    return this.categoryRepository.update(id, data as DeepPartial<Category>);
  }

  remove(id: number) {
    return this.categoryRepository.softDelete(id);
  }
}
