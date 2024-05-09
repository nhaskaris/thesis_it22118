'use client'
import { useState } from 'react';

import { Contract, Holiday } from "@/types/pages";
import TimesheetCalendar from '@/components/TimesheetRelated/TimesheetCalendar';
import { isObjectActive } from '@/Utils/formatTimestamp';

export default function Home({searchParams}: {searchParams: {data: string, holidays: string}}) {
    //call the api to get the holidays

    const contracts: Contract[] = JSON.parse(searchParams.data);

    const holidays: Holiday[] = JSON.parse(searchParams.holidays);

    const activeContracts = contracts.filter((contract) => isObjectActive(contract.interval));

    const [selectedContract, setSelectedContract] = useState<Contract>();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {}

    const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedContract(contracts.find((contract) => contract._id === e.target.value));
    }

    return (
        <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
            <h1 className="text-3xl font-semibold mb-4">Create a New Timesheet</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="selectedContract" className="block text-sm font-medium text-white">Select Contract:</label>
                    <select id="selectedContract" value={selectedContract ? selectedContract._id : ''} onChange={handleContractChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900">
                        <option value="">Select Contract</option>
                        {activeContracts.map((contract) => (
                            <option key={contract._id} value={contract._id}>{contract.project.title + ', ' + contract.human.lastName + ' ' + contract.human.firstName}</option>
                        ))}
                    </select>

                    {selectedContract && <TimesheetCalendar selectedContract={selectedContract} holidays={holidays} />}
                </div>
            </form>
        </div>
    );
}