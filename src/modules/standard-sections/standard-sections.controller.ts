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
  CreateStandardSectionDto,
  createStandardSectionDtoScheme,
} from './dto/create-standard-section.dto';
import {
  UpdateStandardSectionDto,
  updateStandardSectionDtoScheme,
} from './dto/update-standard-section.dto';
import { StandardSectionsService } from './standard-sections.service';
import { serviceResponse } from '../../helpers/response';
import { StandardSectionResource } from './resources/standard-section.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('standard-sections')
export class StandardSectionsController {
  constructor(private readonly service: StandardSectionsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createStandardSectionDtoScheme))
    payload: CreateStandardSectionDto,
  ) {
    const response = await this.service.create(payload);
    return serviceResponse.success(
      StandardSectionResource.toResponse(response),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(StandardSectionResource.toCollection(data));
  }

  @Get('standard/:standardId')
  async findByStandard(@Param('standardId') standardId: number) {
    const data = await this.service.findByStandard(Number(standardId));
    return serviceResponse.success(StandardSectionResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(Number(id));
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(StandardSectionResource.toResponse(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateStandardSectionDtoScheme))
    payload: UpdateStandardSectionDto,
  ) {
    const response = await this.service.update(Number(id), payload);
    let message = HttpResponseMessages.UPDATED;
    if (!response) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(
      StandardSectionResource.toResponse(response),
      message,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.service.remove(Number(id));
    let message = HttpResponseMessages.DELETED;
    if (!data?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }
}

