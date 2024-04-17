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
import { LinkUserDto } from './dto/link-user.dto';

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

  @Roles(Role.User, Role.Admin)
  @Patch('updateInfo')
  updateInfo(@Body() updateUserInfoDto: InsertUserInfoDto) {
    return this.usersService.updateInfo(updateUserInfoDto);
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
    return this.usersService.insertInfo(request.user!.uid, insertUserInfoDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles(Role.User, Role.Admin)
  @Get('getProfile')
  async profile(@Req() request: IGetUserAuthInfoRequest) {
    if (!request.user) {
      return;
    }

    if (request.user.role == 'admin') {
      return await this.usersService.getAllInfo();
    } else {
      if (request.user.linked_users.length > 0) {
        return await this.usersService.getAllInfoLinkedUsers(request.user);
      }
    }

    return request.user;
  }

  @Roles(Role.User, Role.Admin)
  @Get('linkedUsers')
  async getLinkedUsers(@Req() request: IGetUserAuthInfoRequest) {
    return this.usersService.getLinkedUsers(request.user!.uid);
  }

  @Roles(Role.User, Role.Admin)
  @Delete('unlinkUser/:email')
  async unlinkUser(
    @Req() request: IGetUserAuthInfoRequest,
    @Param('email') email: string,
  ) {
    return this.usersService.unlinkUser(request.user!.uid, email);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.User, Role.Admin)
  @Post('linkUser')
  async linkUser(
    @Req() request: IGetUserAuthInfoRequest,
    @Body() linkUserDto: LinkUserDto,
  ) {
    return this.usersService.linkUser(request.user!.uid, linkUserDto);
  }
}
