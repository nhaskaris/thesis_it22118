import { Human } from 'src/humans/schemas/humans.schema';
import { Project } from 'src/projects/schemas/projects.schemas';
import { Wp } from 'src/wps/schemas/wps.schema';

export class CreateTimesheetDto {
   readonly project: Project;
   readonly human: Human;
   readonly date: string;
   readonly hours: number;
   readonly wp: Wp;
}
