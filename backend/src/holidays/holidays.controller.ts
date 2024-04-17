import { Controller, Get } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/types/role.enum';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  async findAll() {
    return await this.holidaysService.findAll();
  }
}
