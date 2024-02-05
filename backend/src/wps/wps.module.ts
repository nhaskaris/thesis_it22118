import { Module } from '@nestjs/common';
import { WpsService } from './wps.service';
import { WpsController } from './wps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wps, WpsSchema } from './schemas/wps.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wps.name, schema: WpsSchema }])],
  controllers: [WpsController],
  providers: [WpsService],
  exports: [WpsService],
})
export class WpsModule {}
