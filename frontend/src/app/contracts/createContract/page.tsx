'use client'

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertInfo, Contract, Human, Project, Wp } from '@/types/pages';
import Alert from '@/components/Alert';
import dayjs from 'dayjs';

const NewContractPage: React.FC = () => {
  const [intervalStart, setIntervalStart] = useState('');
  const [duration, setDuration] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>();
  const [totalCost, setTotalCost] = useState<number>();
  const [selectedPerson, setSelectedPerson] = useState<Human>();
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [selectedWorkPackages, setSelectedWorkPackages] = useState<string[]>([]);
  const [alert, setAlert] = useState<AlertInfo | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const wps: Wp[] = [];

    for (const wpId of selectedWorkPackages) {
      for (const wp of selectedProject!.wps) {
        if (wp._id === wpId) {
          wps.push(wp);
          break;
        }
      }
    }

    if (hourlyRate! * 143* Number(duration) > totalCost!) {
      setAlert({ message: `Hourly Rate ${hourlyRate} * ${duration} months exceeds total cost of contract ${totalCost}$`, severity: 'error', visible: true, onClose: () => setAlert(null)});
      return;
    }

    const newContract: Contract = {
      hourlyRate: hourlyRate!,
      totalCost: totalCost!,
      human: selectedPerson!,
      project: selectedProject!,
      wps: wps,
      duration: {
        startDate: String(new Date(intervalStart).getTime()),
        endDate: String(dayjs(intervalStart).add(Number(duration), 'month').toDate().getTime())
      }
    }

    const res = await fetch('/api', { 
      method: 'POST', 
      body: JSON.stringify({"contract": newContract}), 
      headers: { 
          'Content-Type': 'application/json' 
      }
    });

    window.location.href = '/contracts';
  };

  const globalProjects: Project[] = [];
  const globalHumans: Human[] = [];

  function GetSearchParamsHumans() {
    const searchParams = useSearchParams()

    const humans: Human[] = JSON.parse(searchParams.get('humans') as string);

    globalHumans.push(...humans);

    return (
      <select id="selectedPerson" value={selectedPerson ? selectedPerson._id : ''} onChange={handleHumanChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900">
        <option value="">Select Person</option>
        {humans && humans.map((human: Human) => (
          <option key={human._id} value={human._id}>{human.lastName + ' ' + human.firstName}</option>
        ))}
      </select>
    )
  }

  function GetSearchParamsProjects() {
    const searchParams = useSearchParams()

    const projects: Project[] = JSON.parse(searchParams.get('projects') as string);

    globalProjects.push(...projects);

    return (
      <select id="selectedProject" value={selectedProject ? selectedProject._id : ''} onChange={handleProjectChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900">
            <option value="">Select Project</option>
            {projects.map((project: Project) => (
              <option key={project._id} value={project._id}>{project.title}</option>
            ))}
          </select>
    )
  }

  const handleProjectChange = (e: any) => {
    for(const project of globalProjects) {
      if (project._id == e.target.value) {
        setSelectedProject(project);
        break;
      }
    }
  }

  const handleHumanChange = (e: any) => {
    for(const human of globalHumans) {
      if (human._id == e.target.value) {
        setSelectedPerson(human);
        break;
      }
    }
  }

  const handleWorkPackageChange = (e: React.ChangeEvent<HTMLInputElement>, wpId: string) => {
    const isChecked = e.target.checked;
    setSelectedWorkPackages(prevSelected => {
      if (isChecked) {
        return [...prevSelected, wpId];
      } else {
        return prevSelected.filter(id => id !== wpId);
      }
    });
  };

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  return (
    <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Create a New Contract</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label htmlFor="intervalStart" className="block text-sm font-medium text-white-700">
                Start Date of Contract
              </label>
              <input
                type="date"
                id="intervalStart"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
                value={intervalStart}
                onChange={(e) => setIntervalStart(e.target.value)}
                required
                min={dayjs().format('YYYY-MM-DD')}
              />
            </div>
            <div>
              <label htmlFor="intervalEnd" className="block text-sm font-medium text-white-700">
                Duration of Contract(Months)
              </label>
              <input
                type="number"
                id="intervalEnd"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>
        
        <div className="mb-4">
          <label htmlFor="hourlyCost" className="block text-sm font-medium text-white">Hourly Rate:</label>
          <input type="number" id="hourlyCost" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900" />
        </div>

        <div className="mb-4">
          <label htmlFor="totalCost" className="block text-sm font-medium text-white">Total Cost:</label>
          <input type="number" id="totalCost" value={totalCost} onChange={(e) => setTotalCost(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900" />
        </div>

        <div className="mb-4">
          <label htmlFor="selectedPerson" className="block text-sm font-medium text-white">Select Person:</label>
          <Suspense fallback={<Loading />}>
            <GetSearchParamsHumans />
          </Suspense>
        </div>

        <div className="mb-4">
          <label htmlFor="selectedProject" className="block text-sm font-medium text-white">Select Project:</label>
          <Suspense fallback={<Loading />}>
            <GetSearchParamsProjects />
          </Suspense>
        </div>

        {selectedProject && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Select Work Packages:</label>
            {selectedProject.wps.map((wp: Wp) => (
              <div key={wp._id} className="flex items-center">
                <input type="checkbox" id={wp._id} checked={selectedWorkPackages.includes(wp._id!)} onChange={(e) => handleWorkPackageChange(e, wp._id!)} className="mr-2"/>
                <label htmlFor={wp._id} className="text-sm text-white">{wp.title}</label>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button type="button" onClick={() => router.push('/contracts')} className="w-1/2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400">Cancel</button>
          <button type="submit" className="w-1/2 ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Create Contract</button>
        </div>

        <div>
          {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
        </div>
      </form>
    </div>
  );
};

export default NewContractPage;
