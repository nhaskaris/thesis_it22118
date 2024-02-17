import { Module } from '@nestjs/common';
import { WpsService } from './wps.service';
import { WpsController } from './wps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wp, WpSchema } from './schemas/wps.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wp.name, schema: WpSchema }])],
  controllers: [WpsController],
  providers: [
    WpsService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  exports: [WpsService],
})
export class WpsModule {}
