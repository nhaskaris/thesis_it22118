import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { HolidaysService } from './holidays/holidays.service';
//import a js file that will create first user from scripts/create_admin_user.js
import { create_admin_user } from '../scripts/create_admin_user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);
  app.useGlobalGuards(
    new AuthGuard(new Reflector(), authService, usersService),
  );

  await app.listen(process.env.PORT || 3000, async () => {
    await create_admin_user(authService.firebaseApp);

    await app.get(HolidaysService).handleCron();
  });
}
bootstrap();
