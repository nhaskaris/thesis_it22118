import { Module } from '@nestjs/common';
import { HumansService } from './humans.service';
import { HumansController } from './humans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Humans, HumansSchema } from './schemas/humans.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Humans.name, schema: HumansSchema }]),
  ],
  controllers: [HumansController],
  providers: [HumansService],
})
export class HumansModule {}
