import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { initializeApp } from 'firebase-admin';
import { IGetUserAuthInfoRequest } from 'src/types/userAuthInfoRequest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IGetUserAuthInfoRequest>();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const firebaseConfig = {
      apiKey: this.configService.get('API_KEY'),
      authDomain: this.configService.get('AUTH_DOMAIN'),
      projectId: this.configService.get('PROJECT_ID'),
      storageBucket: this.configService.get('STORAGE_BUCKET'),
      messagingSenderId: this.configService.get('MESSAGING_SENDER_ID'),
      appId: this.configService.get('APP_ID'),
      measurementId: this.configService.get('MEASUREMENT_ID'),
    };

    const firebaseApp = initializeApp(firebaseConfig);

    try {
      const uid = (await firebaseApp.auth().verifyIdToken(token)).uid;
      request['uid'] = uid;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
