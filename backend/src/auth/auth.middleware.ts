import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { parseCookies } from 'nookies';
import { IGetUserAuthInfoRequest } from 'src/types/userAuthInfoRequest';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
   use(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
      const cookies = parseCookies({ req });
      if (cookies['token']) {
         req.headers['authorization'] = `Bearer ${cookies['token']}`;
      }
      next();
   }
}
