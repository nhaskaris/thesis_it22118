import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Project } from 'src/projects/schemas/projects.schemas';
import { Contract } from 'src/contracts/schemas/contracts.schema';
import { Human } from 'src/humans/schemas/humans.schema';
import { Wp } from 'src/wps/schemas/wps.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {
   projects?: Project[];
   contracts?: Contract[];
   humans?: Human[];
   wps?: Wp[];
}
