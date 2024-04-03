'use client'

import { useState } from 'react';
import { AlertInfo, Human } from '@/types/pages';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';

const NewHumanPage: React.FC = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [vat, setVat] = useState('');
  const [alert, setAlert] = useState<AlertInfo | null>(null);
  const router = useRouter();

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleVatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVat(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newHuman: Human = {
      lastName,
      firstName,
      vat
    };

    // check if the vat is 9 characters long and only contains numbers
    if (newHuman.vat.length !== 9 || !newHuman.vat.match(/^\d+$/)) {
      setAlert({ message: 'VAT should be 9 characters long', severity: 'error', visible: true, onClose: () => setAlert(null)});
      return;
    }

    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"human":newHuman})
    });
    
    if (res.ok) {
      window.location.href = '/people';
    } else {
      setAlert({ message: res.statusText, severity: 'error', visible: true, onClose: () => setAlert(null)});
    }
  };

  const handleCancel = () => {
    router.push('/people');
  };

  return (
    <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Add New Human</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-white-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-white-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="vat" className="block text-sm font-medium text-white-700">
            VAT
          </label>
          <input
            type="text"
            id="vat"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={vat}
            onChange={handleVatChange}
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
            Add Human
          </button>
        </div>
        <div>
          {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
        </div>
      </form>
    </div>
  );
};

export default NewHumanPage;
