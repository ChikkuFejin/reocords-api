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
  addQuestionDto,
  assessmentDtoSchema,
  assesssmentSectionAddQuestionsSchema,
  CreateAssessmentDto,
  UpdateAssessmentDto,
} from './dto/assessments.dto';
import { serviceResponse } from '../../helpers/response';
import { AssessmentResource } from './resources/assessment.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { AssessmentsService } from './assessments.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('assessments')
export class AssessmentController {
  constructor(private readonly service: AssessmentsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(assessmentDtoSchema))
    payload: CreateAssessmentDto,
  ) {
    const respnonse = await this.service.create(payload);
    return serviceResponse.success(
      AssessmentResource.toResponse(respnonse),
      // respnonse,
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(AssessmentResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(AssessmentResource.toResponse(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(assessmentDtoSchema))
    payload: UpdateAssessmentDto,
  ) {
    const assessment = await this.service.findOne(id);
    if (!assessment) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    const respnonse = await this.service.update(assessment, payload);
    console.log(respnonse);
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

  @Post('add-questions')
  async addQuestions(
    @Body(new ZodValidationPipe(assesssmentSectionAddQuestionsSchema))
    payload: addQuestionDto,
  ) {
    const response = await this.service.mappingQuestion(payload);
    return serviceResponse.success(response);
  }

  @Post('section-questions/:assessmentId')
  async getSectionQuestions(@Param('assessmentId') assessmentId: number) {
    const response =
      await this.service.getSectionQuestionsByAssessment(assessmentId);
    return serviceResponse.success(response);
  }
}
