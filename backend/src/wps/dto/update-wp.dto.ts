import { PartialType } from '@nestjs/mapped-types';
import { CreateWpDto } from './create-wp.dto';
import { Interval } from '../../types/interval';

export class UpdateWpDto extends PartialType(CreateWpDto) {
   newActiveIntervals: Interval[];
}
