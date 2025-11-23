import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';
import { serviceResponse } from './response';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const DEFAULT_EXPIRES_IN = '1H';

export function generateToken(
  payload: object,
  expiresIn:jwt.SignOptions['expiresIn'] = DEFAULT_EXPIRES_IN,
): string {
  const options: jwt.SignOptions = {
    expiresIn: expiresIn,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new BadRequestException(serviceResponse.invalidTokenError());
  }
}
