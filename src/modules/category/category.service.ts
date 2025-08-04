import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto, parent: Category | null = null) {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.is_active = createCategoryDto.is_active ?? true;
    if (parent) {
      category.parent = parent;
    }
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find({
      where: { deleted_at: IsNull(), parent: IsNull() },
      relations: ['children'],
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
    };
    if (parent) {
      data['parent'] = parent;
    }
    return this.categoryRepository.update(id, data);
  }

  remove(id: number) {
    return this.categoryRepository.softDelete(id);
  }
}
