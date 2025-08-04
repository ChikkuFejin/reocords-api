import { Body, Controller, Post, Res } from '@nestjs/common';
import { BodyDto } from '../../utils/dto/body.dto';
import { Response } from 'express';
import { RouterService } from '../../router.service';

@Controller('product-master')
export class ProductMasterController {
  constructor(private readonly routeService: RouterService) {}

  @Post('services')
  service(
    @Body() bodyDto: BodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.routeService.routes(bodyDto, res);
  }
}
