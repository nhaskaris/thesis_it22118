import { Interval } from '../../types/interval';

export class CreateWpDto {
   readonly title: string;
   readonly activeIntervals: Interval[];
}
