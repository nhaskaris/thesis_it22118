import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { HumansService } from './humans.service';
import { CreateHumanDto } from './dto/create-human.dto';
import { Response } from 'express';

@Controller('humans')
export class HumansController {
  constructor(private readonly humansService: HumansService) {}

  @Post()
  async create(@Body() createHumanDto: CreateHumanDto, @Res() res: Response) {
    try {
      return await this.humansService.create(createHumanDto);
    } catch (e) {
      res.status(400).send(e.message);
    }
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
