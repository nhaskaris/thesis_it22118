import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HumansService } from './humans.service';
import { CreateHumanDto } from './dto/create-human.dto';

@Controller('humans')
export class HumansController {
   constructor(private readonly humansService: HumansService) {}

   @Post()
   async create(@Body() createHumanDto: CreateHumanDto) {
      return await this.humansService.create(createHumanDto);
   }

   @Get()
   findAll() {
      return this.humansService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.humansService.findOne(id);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.humansService.remove(id);
   }
}
