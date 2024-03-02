'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Timesheet, Human, Project, Wp } from '@/types/pages';

const NewTimesheetPage: React.FC = () => {
    const [date, setDate] = useState('');
    const [selectedPerson, setSelectedPerson] = useState<Human>();
    const [selectedProject, setSelectedProject] = useState<Project>();
    const [selectedWorkPackages, setSelectedWorkPackages] = useState<string[]>([]);
    const [hours, setHours] = useState<number>();
    
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let wp: Wp;

        for (const wpId of selectedWorkPackages) {
            for (const selectedWp of selectedProject!.wps) {
                if (selectedWp._id === wpId) {
                wp = selectedWp;
                break;
                }
            }
        }

        const newTimesheet: Timesheet = {
            human: selectedPerson!,
            project: selectedProject!,
            wp: wp!,
            hours: hours!,
            date: String(new Date(date).getTime())
        }

        const res = await fetch('/api', { 
        method: 'POST', 
        body: JSON.stringify({"timesheet": newTimesheet}), 
        headers: { 
            'Content-Type': 'application/json' 
        }
        });

        window.location.href = '/timesheets';
    };

    const searchParams = useSearchParams()

    const humans: Human[] = JSON.parse(searchParams.get('humans')!);
    const projects: Project[] = JSON.parse(searchParams.get('projects')!);

    const handleProjectChange = (e: any) => {
            const project = projects.find(project => project._id === e.target.value);
            setSelectedProject(project!);
    }

    const handleHumanChange = (e: any) => {
        const human = humans.find(human => human._id === e.target.value);
        setSelectedPerson(human!);
    }

    const handleWorkPackageChange = (e: any, wpId: string) => {
        if (e.target.checked) {
        setSelectedWorkPackages([...selectedWorkPackages, wpId]);
        } else {
        setSelectedWorkPackages(selectedWorkPackages.filter(id => id !== wpId));
        }
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Create a new timesheet</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label htmlFor="date" className="mb-2">Select a Date</label>
                    <input type="date" id="date" required value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-md p-2 text-black" />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="hours" className="mb-2">Select Hours</label>
                    <input type="number" id="hours" required value={hours} onChange={(e) => setHours(Number(e.target.value))} className="border border-gray-300 rounded-md p-2 text-black" />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="selectedPerson" className="mb-2">Select a person</label>
                    <select id="selectedPerson" required value={selectedPerson?._id} onChange={handleHumanChange} className="border border-gray-300 rounded-md p-2 text-black">
                        <option value="">Select Person</option>
                        {humans.map(human => <option key={human._id} value={human._id}>{human.lastName}, {human.firstName}</option>)}
                    </select>
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="selectedProject" className="mb-2">Select a project</label>
                    <select id="selectedProject" required value={selectedProject?._id} onChange={handleProjectChange} className="border border-gray-300 rounded-md p-2 text-black">
                        <option value="">Select Project</option>
                        {projects.map(project => <option key={project._id} value={project._id}>{project.title}</option>)}
                    </select>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Select work packages</label>
                    {selectedProject?.wps.map(wp => (
                        <div key={wp._id} className="flex items-center mb-2">
                        <input type="checkbox" id={wp._id} value={wp._id} onChange={(e) => handleWorkPackageChange(e, wp._id!)} className="mr-2 text-black" />
                        <label htmlFor={wp._id}>{wp.title}</label>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-between">
                    <button type="button" onClick={() => router.push('/timesheets')} className="w-1/2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400">Cancel</button>
                    <button type="submit" className="w-1/2 ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Create Contract</button>
                </div>
            </form>
        </div>
    );
}

export default NewTimesheetPage;