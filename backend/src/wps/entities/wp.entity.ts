import { Interval } from '../../types/interval';

// workpackage entity will have a title and an array of active intervals
export class Wp {
  private title: string;
  private activeIntervals: Interval[];

  constructor(title: string, activeIntervals: Interval[]) {
    this.title = title;
    this.activeIntervals = activeIntervals;
  }
}
