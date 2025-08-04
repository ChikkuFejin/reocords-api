import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RouterService } from '../router.service';
import { BodyDto } from '../utils/dto/body.dto';

@Controller('auth-master')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly routeService: RouterService,
  ) {}

  @Post('services')
  async login(
    @Body() bodyDto: BodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.routeService.routes(bodyDto, res);
    // return this.authService.login(loginDto, res);
  }
}
