import { Module } from '@nestjs/common';
import { HumansService } from './humans.service';
import { HumansController } from './humans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Human, HumanSchema } from './schemas/humans.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Human.name, schema: HumanSchema }]),
  ],
  controllers: [HumansController],
  providers: [
    HumansService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class HumansModule {}
