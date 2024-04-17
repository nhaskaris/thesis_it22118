import { Human } from 'src/humans/schemas/humans.schema';
import { Interval } from 'src/types/interval';
import { Wp } from 'src/wps/schemas/wps.schema';

export class CreateContractDto {
  readonly projectId: string;
  readonly human: Human;
  readonly wps: Wp[];
  readonly duration: Interval;
  readonly hourlyRate: number;
  readonly totalCost: number;
}
