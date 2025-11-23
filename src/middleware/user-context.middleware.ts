import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // JWT authentication is handled by the global AuthGuard.
    // This middleware intentionally does not mutate req.user.
    next();
  }
}
