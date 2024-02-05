import { Interval } from '../../types/interval';
import { Wp } from '../../wps/entities/wp.entity';

export class Project {
  private title: string;
  private description: string;
  private wps: Wp[];
  private interval: Interval;

  constructor(
    title: string,
    description: string,
    wps: Wp[],
    interval: Interval,
  ) {
    this.title = title;
    this.description = description;
    this.wps = wps;
    this.interval = interval;
  }
}
