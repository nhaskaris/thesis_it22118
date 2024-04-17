import { CreateContractDto } from 'src/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/contracts/dto/update-contract.dto';
import { Human } from 'src/humans/schemas/humans.schema';
import { Project } from 'src/projects/schemas/projects.schemas';
import { Timesheet } from 'src/timesheets/schemas/timesheets.schemas';
import { Wp } from 'src/wps/schemas/wps.schema';

export class InsertUserInfoDto {
  project?: Project;
  contract?: CreateContractDto | UpdateContractDto;
  human?: Human;
  wp?: Wp;
  timesheet?: Timesheet;
  oldHuman?: Human;
}
