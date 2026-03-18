import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from 'src/types/userAuthInfoRequest';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (token) {
      req.headers['authorization'] = `Bearer ${token}`;
    }
    next();
  }
}
