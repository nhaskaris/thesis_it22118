import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { Interval } from 'src/types/interval';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  changedActiveInterval: Interval;
}
