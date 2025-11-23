import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateStandardDto,
  createStandardDtoScheme,
  standardSectionDto,
  standardSectionScheme,
  UpdateStandardDto,
} from './dto/standards.dto';
import { serviceResponse } from '../../helpers/response';
import { StandardsResource } from './resources/standards.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { StandardsService } from './standards.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('standards')
export class StandardsController {
  constructor(private readonly service: StandardsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createStandardDtoScheme))
    payload: CreateStandardDto,
    @CurrentUser() user: User,
  ) {
  
    const respnonse = await this.service.create(payload, user.institution_id);
    return serviceResponse.success(
      StandardsResource.toResponse(respnonse),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    const data = await this.service.findAll(user.institution_id);
    return serviceResponse.success(StandardsResource.toCollection(data));
  }

  @Get(':id/categories')
  async getStandardCategories(@Param('id') id: number) {
    const standard = await this.service.getCategoriesByStandard(id);
    if (!standard) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(StandardsResource.toResponse(standard));
  }

  @Get(':id/sections')
  async getSections(@Param('id') id: number) {
    const data = await this.service.getSectionsByStandard(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(StandardsResource.toResponse(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(StandardsResource.toResponse(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(createStandardDtoScheme))
    payload: UpdateStandardDto,
  ) {
    const respnonse = await this.service.update(id, payload);
    let message = HttpResponseMessages.UPDATED;
    if (!respnonse?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.service.remove(id);
    let message = HttpResponseMessages.DELETED;
    if (!data?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Post('institution/:id')
  async findByInstitution(@Param('id') id: number) {
    const data = await this.service.findByInstitution(id);
    return serviceResponse.success(StandardsResource.toCollection(data));
  }

  @Post('add-standard-section')
  async addStandardSection(
    @Body(new ZodValidationPipe(standardSectionScheme)) dto: standardSectionDto,
    @CurrentUser() user: User,
  ) {
    const institution_id: number | null = user.institution_id || null;
    const response = await this.service.standardSection(dto, institution_id);
    return serviceResponse.success(StandardsResource.toResponse(response));
  }

}
