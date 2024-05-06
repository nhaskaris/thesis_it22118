export interface Project {
    id: string;
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
    contracts: Contract[];
    timesheets: Timesheet[];
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

export interface Timesheet {
    days: Day[];
    contract: Contract;
    timestamp_created: string;
    _id?: string;
}

export interface Day {
    date: string;
    workPackages: WorkPackage[];
  }
  
  interface WorkPackage {
    wp: Wp;
    hours: number;
  }
  

export interface Holiday {
    dateIso: string;
    description: string;
    _id?: string;
    name: string;
    type: string[];
}