import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { verifyToken } from '../helpers/jwt.helper';
import { UserService } from '../user/user.service';
import { serviceResponse } from '../helpers/response';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new BadRequestException(serviceResponse.unAuthorizedError());
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadRequestException(serviceResponse.unAuthorizedError());
    }
    try {
      const decoded = verifyToken(token);
      const userId = decoded.userId;
      if (!userId) {
        throw new BadRequestException(serviceResponse.invalidTokenError('Invalid token payload'));
      }
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new BadRequestException(serviceResponse.notFoundError('User not found'));
      }
      request['user'] = user;
      return true;
    } catch (err) {
      throw new BadRequestException(serviceResponse.invalidTokenError());
    }
  }
} 