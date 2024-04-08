import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/types/userAuthInfoRequest';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './auth.decorator';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private reflector: Reflector,
      private readonly authService: AuthService,
      private readonly usersService: UsersService,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context
         .switchToHttp()
         .getRequest<IGetUserAuthInfoRequest>();

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
         ROLES_KEY,
         [context.getHandler(), context.getClass()],
      );

      const token = request.headers['authorization']?.split(' ')[1];
      if (!token) {
         throw new UnauthorizedException('Unauthorized');
      }

      try {
         const uid = (
            await this.authService.firebaseApp.auth().verifyIdToken(token)
         ).uid;

         if (!requiredRoles) {
            return true;
         }

         const user = await this.usersService.findOne(uid);

         if (!user) {
            throw new UnauthorizedException('Unauthorized');
         }

         request.user = user;

         return requiredRoles.includes(user.role);
      } catch (error) {
         throw new UnauthorizedException('Unauthorized');
      }
   }
}
