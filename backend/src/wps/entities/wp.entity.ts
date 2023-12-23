import { Interval } from '../../types/interval';

// workpackage entity will have a title and an array of active intervals
export class Wp {
  title: string;
  activeIntervals: Interval[];
}
