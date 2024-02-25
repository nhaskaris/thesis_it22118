'use client'

import { useState } from 'react';
import { Project, Wp, Interval, AlertInfo } from '@/types/pages';
import { useRouter } from 'next/navigation'
import Alert from '@/components/Alert';

const NewProjectPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workPackages, setWorkPackages] = useState<Wp[]>([{ title: '', activeIntervals: [] }]);
  const [intervalStart, setIntervalStart] = useState('');
  const [intervalEnd, setIntervalEnd] = useState('');
  const router = useRouter()

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const [alert, setAlert] = useState<AlertInfo | null>(null);

  // Function to display the alert
  const showAlert = (message: string, severity: string) => {
    setAlert({ message, severity, visible: true, onClose: () => setAlert(null)});
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleWorkPackageChange = (index: number, field: keyof Wp, value: string) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[index] = {
      ...updatedWorkPackages[index],
      [field]: value
    };
    setWorkPackages(updatedWorkPackages);
  };

  const handleAddWorkPackage = () => {
    setWorkPackages([...workPackages, { title: '', activeIntervals: [] }]);
  };

  const handleRemoveWorkPackage = (index: number) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages.splice(index, 1);
    setWorkPackages(updatedWorkPackages);
  };

  const handleAddInterval = (index: number) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[index].activeIntervals.push({ startDate: '', endDate: '' });
    if(updatedWorkPackages[index].activeIntervals.length == 1) {
      updatedWorkPackages[index].activeIntervals.push({ startDate: '', endDate: '' });
    }
    setWorkPackages(updatedWorkPackages);
  };

  const handleRemoveInterval = (wpIndex: number, intervalIndex: number) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[wpIndex].activeIntervals.splice(intervalIndex, 1);
    setWorkPackages(updatedWorkPackages);
  }

  const handleIntervalChange = (wpIndex: number, intervalIndex: number, field: keyof Interval, value: string) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[wpIndex].activeIntervals[intervalIndex] = {
      ...updatedWorkPackages[wpIndex].activeIntervals[intervalIndex],
      [field]: value
    };
    setWorkPackages(updatedWorkPackages);
  };

  const parseDateToTimestamp = (dateString: string) => {
    const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // Months are 0-based in JavaScript Date object
      const year = parseInt(match[3], 10);
      
      // Check if the parsed date components are valid
      if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        return new Date(year, month, day).getTime(); // Return Unix timestamp in milliseconds
      }
    }
    return null; // Return null if parsing fails or date components are invalid
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newProject: Project = {
      title,
      description,
      wps: workPackages,
      interval: { startDate: intervalStart, endDate: intervalEnd },
    };

    for (const wp of newProject.wps) {
      for (const interval of wp.activeIntervals) {
        const startDate = parseDateToTimestamp(interval.startDate);
        const endDate = parseDateToTimestamp(interval.endDate);

        if (startDate && endDate) {
          interval.startDate = String(startDate);
          interval.endDate = String(endDate);
        } else {
          return showAlert('Invalid date format. Use dd/mm/yyyy', 'critical');
        }
      }
    }

    const startDate = parseDateToTimestamp(newProject.interval.startDate);
    const endDate = parseDateToTimestamp(newProject.interval.endDate);

    if (!startDate || !endDate) {
      return showAlert('Invalid date format. Use dd/mm/yyyy', 'critical');
    }

    //convert to Unix time
    newProject.interval.startDate = String(endDate);
    newProject.interval.endDate = String(endDate);
    
    const res = await fetch('/api', { 
        method: 'POST', 
        body: JSON.stringify({"project": newProject}), 
        headers: { 
            'Content-Type': 'application/json' 
        }
    });

    if (!res.ok) {
      return showAlert(res.statusText, 'critical');
    }

    router.push('/projects')
    router.refresh()
  };

  const handleCancel = () => {
    router.push('/projects')
  }

  return (
    <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Create a New Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-white-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-white-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        {workPackages.map((wp, wpIndex) => (
          <div key={wpIndex} className="mb-4">
            <label className="block text-sm font-medium text-white-700 mb-1">Work Package {wpIndex + 1}</label>
            <input
              type="text"
              value={wp.title}
              onChange={(e) => handleWorkPackageChange(wpIndex, 'title', e.target.value)}
              className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
              required
            />
            <div className="mb-2 ml-4">
              <label className="block text-sm font-medium text-white-700 mb-1">Start Date 1</label>
              <input
                type="text"
                value={wp.activeIntervals[0] ? wp.activeIntervals[0].startDate : ''}
                onChange={(e) => handleIntervalChange(wpIndex, 0, 'startDate', e.target.value)}
                className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                required
              />
              <label className="block text-sm font-medium text-white-700 mb-1">End Date 1</label>
              <input
                type="text"
                value={wp.activeIntervals[0] ? wp.activeIntervals[0].endDate : ''}
                onChange={(e) => handleIntervalChange(wpIndex, 0, 'endDate', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                required
              />
            </div>
            {wp.activeIntervals.slice(1).map((interval, intervalIndex) => (
              <div key={intervalIndex + 1} className="mb-2 ml-4">
                <label className="block text-sm font-medium text-white-700 mb-1">Start Date {intervalIndex + 2}</label>
                <input
                  type="text"
                  value={interval.startDate}
                  onChange={(e) => handleIntervalChange(wpIndex, intervalIndex + 1, 'startDate', e.target.value)}
                  className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                  required
                />
                <label className="block text-sm font-medium text-white-700 mb-1">End Date {intervalIndex + 2}</label>
                <input
                  type="text"
                  value={interval.endDate}
                  onChange={(e) => handleIntervalChange(wpIndex, intervalIndex + 1, 'endDate', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddInterval(wpIndex)}
              className="text-blue-600 hover:text-blue-700 focus:outline-none mb-2"
            >
              Add Interval
            </button>
            {wp.activeIntervals && wp.activeIntervals.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveInterval(wpIndex, wp.activeIntervals.length - 1)}
                className="text-red-600 hover:text-red-700 focus:outline-none ml-4"
              >
                Remove Interval
              </button>
            )}
            {workPackages.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveWorkPackage(wpIndex)}
                className="text-red-600 hover:text-red-700 focus:outline-none ml-4"
              >
                Remove Work Package
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddWorkPackage}
          className="text-blue-600 hover:text-blue-700 focus:outline-none mb-4"
        >
          Add Work Package
        </button>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="intervalStart" className="block text-sm font-medium text-white-700">
              Start Date of Project
            </label>
            <input
              type="text"
              id="intervalStart"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
              value={intervalStart}
              onChange={(e) => setIntervalStart(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="intervalEnd" className="block text-sm font-medium text-white-700">
            End Date of Project
            </label>
            <input
              type="text"
              id="intervalEnd"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
              value={intervalEnd}
              onChange={(e) => setIntervalEnd(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Project
          </button>
        </div>
        <div>
          {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;