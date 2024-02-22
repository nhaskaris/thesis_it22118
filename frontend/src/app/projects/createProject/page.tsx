'use client'

import { useState } from 'react';
import { Project, Wp, Interval } from '@/types/pages';
import { useRouter } from 'next/navigation'

//TODO: Button to remove wp intervals and first interval should be mandatory.
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
    setWorkPackages(updatedWorkPackages);
  };

  const handleIntervalChange = (wpIndex: number, intervalIndex: number, field: keyof Interval, value: string) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[wpIndex].activeIntervals[intervalIndex] = {
      ...updatedWorkPackages[wpIndex].activeIntervals[intervalIndex],
      [field]: value
    };
    setWorkPackages(updatedWorkPackages);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newProject: Project = {
      title,
      description,
      wps: workPackages,
      interval: { startDate: intervalStart, endDate: intervalEnd },
    };
    
    // Here you can send the new project data to your backend or perform any other actions
    console.log(newProject);
    const res = await fetch('/projects/api', { 
        method: 'POST', 
        body: JSON.stringify(newProject), 
        headers: { 
            'Content-Type': 'application/json' 
        }
    })

    router.push('/projects')
    router.refresh()
  };

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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
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
              className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
              required
            />
            {wp.activeIntervals.map((interval, intervalIndex) => (
              <div key={intervalIndex} className="mb-2 ml-4">
                <label className="block text-sm font-medium text-white-700 mb-1">Start Date {intervalIndex + 1}</label>
                <input
                  type="text"
                  value={interval.startDate}
                  onChange={(e) => handleIntervalChange(wpIndex, intervalIndex, 'startDate', e.target.value)}
                  className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:

ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
                  required
                />
                <label className="block text-sm font-medium text-white-700 mb-1">End Date {intervalIndex + 1}</label>
                <input
                  type="text"
                  value={interval.endDate}
                  onChange={(e) => handleIntervalChange(wpIndex, intervalIndex, 'endDate', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
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
              Interval Start
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
              Interval End
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
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;