import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/types/role.enum';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Roles(Role.Admin)
   @Post()
   create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
   }

   @Roles(Role.Admin)
   @Get()
   findAll() {
      return this.usersService.findAll();
   }

   @Roles(Role.User, Role.Admin)
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
   }

   @Roles(Role.Admin)
   @Patch(':id')
   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
   }

   @Roles(Role.Admin)
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.usersService.remove(id);
   }
}
