import { Module } from '@nestjs/common';
import { WpsService } from './wps.service';
import { WpsController } from './wps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wp, WpSchema } from './schemas/wps.schema';

@Module({
   imports: [MongooseModule.forFeature([{ name: Wp.name, schema: WpSchema }])],
   controllers: [WpsController],
   providers: [WpsService],
   exports: [WpsService],
})
export class WpsModule {}
