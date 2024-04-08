'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertInfo } from '@/types/pages';
import Alert from '@/components/Alert';

const CreateLinkPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState<AlertInfo | null>(null);
  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Example of form data
    const newUser = {
      email
    };

    // Example of API call to create a new user
    const res = await fetch('/link/api', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        setAlert({ message: res.statusText, severity: 'critical', visible: true, onClose: () => setAlert(null) });
    }

    // Redirect to the users page after successful creation
    
    router.refresh()
    window.location.href = '/link';
  };

  const handleCancel = () => {
    // Redirect to the users page
    router.push('/link');
  };

  return (
    <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Create a New User</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-white-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
            value={email}
            onChange={handleEmailChange}
            required
          />
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
            Create Link
          </button>
        </div>
      </form>
      <div>
        {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
      </div>
    </div>
  );
};

export default CreateLinkPage;