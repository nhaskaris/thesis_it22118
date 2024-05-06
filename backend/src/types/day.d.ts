import { Wp } from 'src/wps/schemas/wps.schema';

export interface Day {
  date: string;
  workPackages: WorkPackage[];
}

interface WorkPackage {
  wp: Wp;
  hours: number;
}
