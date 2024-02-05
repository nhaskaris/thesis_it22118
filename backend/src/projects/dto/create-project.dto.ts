import { Interval } from '../../types/interval';
import { CreateWpDto } from 'src/wps/dto/create-wp.dto';

export class CreateProjectDto {
  readonly title: string;
  readonly description: string;
  readonly wps: CreateWpDto[];
  readonly interval: Interval;
}
