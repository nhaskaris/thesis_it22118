export interface Project {
    title: string;
    description: string;
    wps: Wp[];
    interval: Interval;
    _id?: string;
}

export interface Interval {
    startDate: string;
    endDate: string;
}

export interface Wp {
    title: string;
    _id?: string;
    activeIntervals: Interval[];
}

export interface AlertInfo {
    message: string;
    severity: string;
    visible: boolean;
    onClose: () => void;
}

export interface Human {
    lastName: string;
    firstName: string;
    vat: string;
    _id?: string;
}

export interface InsertInfo {
    human?: Human;
    project?: Project;
}

export interface User {
    email: string;
    role: string;
    _id?: string;
    projects: Project[];
    humans: Human[];
    wps: Wp[];
    contracts: Contract[]
}

export interface UserInsertInfo {
    email: string;
    role: string;
}

export interface Contract {
    project: Project;
    human: Human;
    wps: Wp[];
    duration: Interval;
    hourlyRate: number;
    totalCost: number;
    _id?: string;
}
export interface CreateContractDto {
    projectId: string;
    human: Human;
    wps: Wp[];
    duration: Interval;
    hourlyRate: number;
    totalCost: number;
 }