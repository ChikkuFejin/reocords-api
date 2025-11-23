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
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  CreateQuestionBankDto,
  createQuestionBankDtoSchema,
} from './dto/create-question-bank.dto';
import { serviceResponse } from '../../helpers/response';
import { QuestionBankResource } from './resources/question-bank.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { QuestionBankService } from './question-bank.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';
import { CreateUserDto } from '../users/dto/user.dto';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly service: QuestionBankService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionBankDtoSchema))
  async create(@Body() payload: CreateQuestionBankDto) {
    const respnonse = await this.service.create(payload);
    return serviceResponse.success(
      // QuestionBankResource.toResponse(respnonse),
      respnonse,
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(QuestionBankResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(QuestionBankResource.toResponse(data));
  }

  @Patch(':id')
  // @UsePipes(new ZodValidationPipe(createQuestionBankDtoSchema))
  async update(@Param('id') id: number, @Body() payload: any) {
    const question = await this.service.findOne(id);
    if (!question) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    const respnonse = await this.service.update(id, payload, question);
    let message = HttpResponseMessages.UPDATED;
    if (!respnonse) {
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

  @Post('institution')
  async institution(
    @Body() payload: any,
    @Request() req: ExpressRequest & { user?: CreateUserDto },
  ) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException(serviceResponse.unAuthorizedError());
    }
    const institutionId = user.institution_id || null;
    if (!institutionId) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    const data = await this.service.findAll(payload);
    return serviceResponse.success(QuestionBankResource.toCollection(data));
  }
}
