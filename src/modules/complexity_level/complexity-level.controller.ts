import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UsePipes,
} from '@nestjs/common';
import {
  CreateComplexityLevelDto,
  createcomplexityLevelDtoScheme,
} from './dto/create-complexity-level.dto';
import {
  UpdateComplexityLevelDto,
  updateComplexityLevelDtoScheme,
} from './dto/update-complexity-level.dto';
import { serviceResponse } from '../../helpers/response';
import { ComplexityLevelResource } from './resources/complexity-level.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ComplexityLevelService } from './complexity-level.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('complexity-level')
export class ComplexityLevelController {
  constructor(private readonly service: ComplexityLevelService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createcomplexityLevelDtoScheme))
  async create(@Body() payload: CreateComplexityLevelDto) {
    const respnonse = await this.service.create(payload);
    return serviceResponse.success(
      ComplexityLevelResource.toResponse(respnonse),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(ComplexityLevelResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(ComplexityLevelResource.toResponse(data));
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateComplexityLevelDtoScheme))
  async update(
    @Param('id') id: number,
    @Body() updateQuestionTypeDto: UpdateComplexityLevelDto,
  ) {
    const respnonse = await this.service.update(id, updateQuestionTypeDto);
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
}
