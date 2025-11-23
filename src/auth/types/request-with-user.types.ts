import { Request } from 'express';
import { User } from '../../modules/users/user.entity';

/**
 * Extended Express Request interface with user property
 * This ensures type safety when accessing req.user
 */
export interface RequestWithUser extends Request {
  user: User;
}

