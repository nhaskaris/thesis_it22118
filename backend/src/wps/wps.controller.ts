import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WpsService } from './wps.service';
import { CreateWpDto } from './dto/create-wp.dto';
import { UpdateWpDto } from './dto/update-wp.dto';

@Controller('wps')
export class WpsController {
  constructor(private readonly wpsService: WpsService) {}

  @Post()
  create(@Body() createWpDto: CreateWpDto) {
    return this.wpsService.create(createWpDto);
  }

  @Get()
  findAll() {
    return this.wpsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id', id);
    return this.wpsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWpDto: UpdateWpDto) {
    return this.wpsService.update(id, updateWpDto);
  }

  @Delete()
  remove() {
    return this.wpsService.deleteAll();
  }
}
