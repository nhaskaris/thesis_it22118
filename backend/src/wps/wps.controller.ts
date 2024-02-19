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
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/types/role.enum';

@Roles(Role.Admin)
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

   @Delete(':id')
   removeOne(@Param('id') id: string) {
      return this.wpsService.remove(id);
   }
}
