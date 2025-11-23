import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../modules/users/user.entity';

/**
 * Custom decorator to get the current authenticated user from the request
 * Usage: @CurrentUser() user: User
 * Similar to Laravel's Auth::user() or $request->user()
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

