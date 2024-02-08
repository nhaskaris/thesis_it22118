import { Human } from "src/humans/schemas/humans.schema";
import { Project } from "src/projects/schemas/projects.schemas";
import { Interval } from "src/types/interval";
import { Wp } from "src/wps/schemas/wps.schema";

export class CreateContractDto {
    readonly project: Project;
    readonly human: Human;
    readonly wps: Wp[];
    readonly duration: Interval;
    readonly hourlyRate: Number;
    readonly totalCost: Number
}
