import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   Req,
   HttpException,
   HttpStatus,
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
   findAll(@Req() request: IGetUserAuthInfoRequest) {
      return this.usersService.findAll(request.user!.uid);
   }

   @Roles(Role.Admin)
   @Patch(':uid')
   update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(uid, updateUserDto);
   }

   @Roles(Role.User, Role.Admin)
   @Post('insertInfo')
   insertInfo(
      @Body() insertUserInfoDto: InsertUserInfoDto,
      @Req() request: IGetUserAuthInfoRequest,
   ) {
      try {
         return this.usersService.insertInfo(
            request.user!.uid,
            insertUserInfoDto,
         );
      } catch (error) {
         throw new HttpException(
            error.message,
            error.status || HttpStatus.BAD_REQUEST,
         );
      }
   }

   @Roles(Role.Admin)
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.usersService.remove(id);
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
