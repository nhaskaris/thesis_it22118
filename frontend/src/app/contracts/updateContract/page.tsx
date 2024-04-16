'use client'

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertInfo, Contract, Human, Project, Wp } from '@/types/pages';
import Alert from '@/components/Alert';
import dayjs from 'dayjs';

export default function Home({searchParams}: {searchParams: {data: string}}) {
    const contract: Contract = JSON.parse(searchParams.data);

    const wpIds = contract.wps.map(wp => wp._id);
    
    const dur = dayjs(Number(contract.duration.endDate)).diff(Number(contract.duration.startDate), 'month') + 1;
    const startDate = dayjs(Number(contract.duration.startDate)).format('YYYY-MM-DD');
    const [intervalStart, setIntervalStart] = useState(startDate);
    const [duration, setDuration] = useState(dur);
    const [hourlyRate, setHourlyRate] = useState<number>(contract.hourlyRate);
    const [totalCost, setTotalCost] = useState<number>(contract.totalCost);
    const [selectedWorkPackages, setSelectedWorkPackages] = useState(wpIds);
    const [alert, setAlert] = useState<AlertInfo | null>(null);
    
    const router = useRouter();
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
  
      const wps: Wp[] = [];
  
      for (const wpId of selectedWorkPackages) {
        for (const wp of contract.project!.wps) {
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
  
      const updatedContract = {
        id: contract._id,
        hourlyRate: hourlyRate!,
        totalCost: totalCost!,
        wps: wps,
        duration: {
          startDate: String(new Date(intervalStart).getTime()),
          endDate: String(dayjs(intervalStart).add(Number(duration), 'month').toDate().getTime())
        }
      }
  
      const res = await fetch('/api', { 
        method: 'PATCH', 
        body: JSON.stringify({
          "contract": updatedContract
        }), 
        headers: { 
            'Content-Type': 'application/json' 
        }
      });
  
      if (!res.ok) {
        return setAlert({ message: 'Failed to create contract', severity: 'error', visible: true, onClose: () => setAlert(null)});
      }
  
      window.location.href = '/contracts';
    };
  
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
                  min={startDate}
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
                  onChange={(e) => setDuration(Number(e.target.value))}
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
            <label htmlFor="human" className="block text-sm font-medium text-white">Human:</label>
            <input type="text" id="human" value={contract.human.firstName + ' ' + contract.human.lastName} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900" />
          </div>

          <div className="mb-4">
            <label htmlFor="project" className="block text-sm font-medium text-white">Project ID:</label>
            <input type="text" id="project" value={contract.project.id} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900" />
          </div>

          <div className="mb-4">
              <label className="block text-sm font-medium text-white">Select Work Packages:</label>
              {contract.project.wps.map((wp: Wp, i) => (
                <div key={i} className="flex items-center">
                  <input type="checkbox" id={wp.title} checked={selectedWorkPackages.includes(wp._id!)} onChange={(e) => handleWorkPackageChange(e, wp._id!)} className="mr-2"/>
                  <label htmlFor={wp.title} className="text-sm text-white">{wp.title}</label>
                </div>
              ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button type="button" onClick={() => router.push('/contracts')} className="w-1/2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400">Cancel</button>
            <button type="submit" className="w-1/2 ml-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md focus:outline-none focus:red-700">Edit Contract</button>
          </div>

          <div>
            {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
          </div>
        </form>
      </div>
    );
  };