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
import { ParticipantsService } from './participants.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';
import {
  CreateParticipantDto,
  createParticipantDtoScheme,
} from './dto/create-participant.dto';
import {
  UpdateParticipantDto,
  updateParticipantDtoScheme,
} from './dto/update-participant.dto';
import { serviceResponse } from '../../helpers/response';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ParticipantResource } from './resources/participant.resource';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly service: ParticipantsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createParticipantDtoScheme))
    payload: CreateParticipantDto,
  ) {
    const response = await this.service.create(payload);
    return serviceResponse.success(
      ParticipantResource.toResponse(response),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(ParticipantResource.toCollection(data));
  }

  @Get('standard/:standardId')
  async findByStandard(@Param('standardId') standardId: number) {
    const data = await this.service.findByStandard(Number(standardId));
    return serviceResponse.success(ParticipantResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(Number(id));
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(ParticipantResource.toResponse(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateParticipantDtoScheme))
    payload: UpdateParticipantDto,
  ) {
    const response = await this.service.update(Number(id), payload);
    return serviceResponse.success(
      ParticipantResource.toResponse(response),
      HttpResponseMessages.UPDATED,
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

