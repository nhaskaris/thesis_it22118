import { UpdateWpDto } from 'src/wps/dto/update-wp.dto';
import { Interval } from 'src/types/interval';

export class UpdateProjectDto {
  readonly wps: UpdateWpDto[];
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly interval: Interval;
}
