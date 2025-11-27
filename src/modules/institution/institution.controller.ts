import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';
import { serviceResponse } from '../../helpers/response';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { InstitutionService } from './institution.service';
import {
  CreateInstitutionDto,
  createInstitutionDtoSchema,
} from './dto/create-institution.dto';
import {
  UpdateInstitutionDto,
  updateInstitutionDtoSchema,
} from './dto/update-institution.dto';
import {
  CreateInstitutionUserDto,
  createInstitutionUserDtoSchema,
} from './dto/create-institution-user.dto';
import { InstitutionResource } from './resources/institution.resource';
import { createStandardDtoScheme } from '../standards/dto/standards.dto';

@Controller('institution')
export class InstitutionController {
  constructor(private readonly service: InstitutionService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(createInstitutionDtoSchema))
  async create(@Body() payload: CreateInstitutionDto) {
    const response = await this.service.create(payload);
    return serviceResponse.success(
      InstitutionResource.toResponse(response),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(InstitutionResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(InstitutionResource.toResponse(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateInstitutionDtoSchema))
    payload: UpdateInstitutionDto,
  ) {
    const result = await this.service.update(id, payload);
    let message = HttpResponseMessages.UPDATED;
    if (!result?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.service.remove(id);
    let message = HttpResponseMessages.DELETED;
    if (!result?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Post(':id/user')
  async createUser(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(createInstitutionUserDtoSchema))
    payload: CreateInstitutionUserDto,
  ) {
    const response = await this.service.createUser(id, payload);
    return serviceResponse.success(
      response,
      HttpResponseMessages.CREATED,
    );
  }
}
