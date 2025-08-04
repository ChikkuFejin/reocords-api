import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException, UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  createCategoryDtoScheme,
} from './dto/create-category.dto';
import {
  UpdateCategoryDto,
  updateCategoryDtoScheme,
} from './dto/update-category.dto';
import { serviceResponse } from '../../helpers/response';
import { CategoryResource } from './resources/category.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCategoryDtoScheme))
  async create(@Body() createCategoryDto: CreateCategoryDto) {

    const parentId = createCategoryDto.parent_id ?? null;
    let parent: any = null;
    if (parentId) {
      parent = await this.categoryService.findOne(parentId);
    }

    const response = await this.categoryService.create(createCategoryDto, parent);
    return serviceResponse.success(
      CategoryResource.toResponse(response),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();
    return serviceResponse.success(CategoryResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.categoryService.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(CategoryResource.toResponse(data));
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateCategoryDtoScheme))
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {

    const parentId = updateCategoryDto.parent_id ?? null;
    let parent: any = null;
    if (parentId) {
      parent = await this.categoryService.findOne(parentId);
    }

    const response = await this.categoryService.update(
      id,
      updateCategoryDto,
      parent,
    );
    let message = HttpResponseMessages.UPDATED;
    if (!response?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.categoryService.remove(id);
    let message = HttpResponseMessages.DELETED;
    if (!data?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }
}
