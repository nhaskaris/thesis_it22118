import { Contract } from 'src/contracts/schemas/contracts.schema';
import { Day } from 'src/types/day';

export class CreateTimesheetDto {
  readonly days: Day[];
  readonly contract: Contract;
  readonly timestamp_created: string;
}
