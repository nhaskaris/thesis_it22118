import { Interval } from '../../types/interval';

export class CreateWpDto {
  title: string;
  activeIntervals: Interval[];
}
