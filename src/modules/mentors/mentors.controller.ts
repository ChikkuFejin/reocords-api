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
  CreateMentorDto,
  createMentorDtoScheme,
} from './dto/create-mentor.dto';
import {
  UpdateMentorDto,
  updateMentorDtoScheme,
} from './dto/update-mentor.dto';
import { MentorsService } from './mentors.service';
import { serviceResponse } from '../../helpers/response';
import { MentorResource } from './resources/mentor.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly service: MentorsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createMentorDtoScheme)) payload: CreateMentorDto,
  ) {
    const response = await this.service.create(payload);
    return serviceResponse.success(
      MentorResource.toResponse(response),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(MentorResource.toCollection(data));
  }

  @Get('institution/:institutionId')
  async findByInstitution(@Param('institutionId') institutionId: number) {
    const data = await this.service.findByInstitution(Number(institutionId));
    return serviceResponse.success(MentorResource.toCollection(data));
  }

  @Get('standard/:standardId')
  async findByStandard(@Param('standardId') standardId: number) {
    const data = await this.service.findByStandard(Number(standardId));
    return serviceResponse.success(
      MentorResource.toCollectionWithSections(data),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(Number(id));
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(MentorResource.toResponse(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateMentorDtoScheme)) payload: UpdateMentorDto,
  ) {
    const response = await this.service.update(Number(id), payload);
    let message = HttpResponseMessages.UPDATED;
    if (!response) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(
      MentorResource.toResponse(response),
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

