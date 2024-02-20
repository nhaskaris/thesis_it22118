import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/types/role.enum';
import { IGetUserAuthInfoRequest } from 'src/types/userAuthInfoRequest';
import { InsertUserInfoDto } from './dto/insert-info-user.dto';

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

   @Roles(Role.Admin)
   @Patch(':uid')
   update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(uid, updateUserDto);
   }

   @Roles(Role.User, Role.Admin)
   @Post(':uid')
   insertInfo(
      @Param('uid') uid: string,
      @Body() insertUserInfoDto: InsertUserInfoDto,
   ) {
      return this.usersService.insertInfo(uid, insertUserInfoDto);
   }

   @Roles(Role.Admin)
   @Delete(':uid')
   remove(@Param('uid') uid: string) {
      return this.usersService.remove(uid);
   }

   @Roles(Role.User, Role.Admin)
   @Get('getProfile')
   profile(@Req() request: IGetUserAuthInfoRequest) {
      if (!request.user) {
         return;
      }

      return request.user;
   }

   @Roles(Role.Admin)
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
   }
}
