'use client'
import { Contract, Holiday, Timesheet } from "@/types/pages";
import TimesheetCalendar from '@/components/TimesheetRelated/TimesheetCalendar';
import { use } from "react";

export default function Home({searchParams}: {searchParams: Promise<{ data: string, holidays: string }>}) {
    const params = use(searchParams);

    const timesheet: Timesheet = JSON.parse(params.data);

    const holidays: Holiday[] = JSON.parse(params.holidays);

    const contract: Contract = timesheet.contract;

    return (
        <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
            <h1 className="text-3xl font-semibold mb-4">Edit Timesheet</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Contract</h2>
                <input type="text" value={contract.project.title + ', ' + contract.human.lastName + ' ' + contract.human.firstName} className="w-full border text-black border-gray-300 rounded-md p-2 mt-2" readOnly />
                
                {contract && <TimesheetCalendar selectedContract={contract} holidays={holidays} days={timesheet.days} timesheet_id={timesheet._id}/>}
            </div>
        </div>
    );
}