import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '../helpers/jwt.helper';
import { UserService } from '../modules/users/user.service';
import { serviceResponse } from '../helpers/response';
import { RequestWithUser } from './types/request-with-user.types';

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new BadRequestException(serviceResponse.unAuthorizedError());
    }
    const [scheme, token] = authHeader.split(' ');
    if (!token || scheme !== 'Bearer') {
      throw new BadRequestException(serviceResponse.unAuthorizedError());
    }
    try {
      const decoded: any = verifyToken(token);
      const userId = decoded?.userId as number | undefined;
      if (!userId) {
        throw new BadRequestException(
          serviceResponse.invalidTokenError('Invalid token payload'),
        );
      }
      const user = await this.userService.findOne(Number(userId));
      if (!user) {
        throw new BadRequestException(
          serviceResponse.notFoundError('User not found'),
        );
      }
      // Set user on request object - now type-safe!
      request.user = user;
      return true;
    } catch (err) {
      throw new BadRequestException(serviceResponse.invalidTokenError());
    }
  }
}