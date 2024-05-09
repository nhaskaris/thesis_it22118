import { PartialType } from '@nestjs/mapped-types';
import { CreateWpDto } from './create-wp.dto';

export class UpdateWpDto extends PartialType(CreateWpDto) {
  _id?: string;
}
