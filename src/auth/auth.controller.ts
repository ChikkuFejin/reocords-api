import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RouterService } from '../router.service';
import { BodyDto } from '../utils/dto/body.dto';
import { Public } from './public.decorator';
import { LoginDto } from './dto/login.dto';
import { HttpResponseMessages } from '../constants/http-response-messages';
import { serviceResponse } from '../helpers/response';
import { UserService } from '../modules/users/user.service';

@Controller('auth-master')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly routeService: RouterService,
  ) {}

  @Public()
  @Post('services')
  async login(
    @Body() bodyDto: BodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.routeService.routes(bodyDto, res);
    // return this.authService.login(loginDto, res);
  }

  @Public()
  @Post('login')
  async authLogin(@Body() bodyDto: LoginDto) {
    return await this.userService.login(bodyDto);
    // let message = HttpResponseMessages.SUCCESS;
    // if (!result) {
    //   console.log('result', result);
    //   message = HttpResponseMessages.UNAUTHORIZED;
    // }
    // return serviceResponse.success(null, message);
  }
}
