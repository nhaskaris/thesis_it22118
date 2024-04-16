'use client'

import { useState } from 'react';
import { AlertInfo, Human } from '@/types/pages';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';

export default function UpdateHumanPage({searchParams}: {searchParams: {data: string}}) {
    const humans: Human = JSON.parse(searchParams.data);

  const [lastName, setLastName] = useState(humans.lastName);
  const [firstName, setFirstName] = useState(humans.firstName);
  const [vat, setVat] = useState(humans.vat);
  const [alert, setAlert] = useState<AlertInfo | null>(null);
  const router = useRouter();
  // store the old vat to send it to the backend by cloningi t
  const oldVat = JSON.parse(JSON.stringify(humans.vat));

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

    const oldHuman: Human = {
        lastName: humans.lastName,
        firstName: humans.firstName,
        vat: oldVat
    };

    // check if the vat is 9 characters long and only contains numbers
    if (newHuman.vat.length !== 9 || !newHuman.vat.match(/^\d+$/)) {
      setAlert({ message: 'VAT should be 9 characters long', severity: 'error', visible: true, onClose: () => setAlert(null)});
      return;
    }

    const res = await fetch('/api', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'human': newHuman,
        'oldHuman': oldHuman
      })
    });
    
    if (!res.ok) {
        return setAlert({message: await res.text(), severity: 'error', visible: true, onClose: () => setAlert(null)});
      }
  
      window.location.href = '/people';
  };

  const handleCancel = () => {
    router.push('/people');
  };

  return (
    <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Update Human</h1>
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
            className="w-1/2 ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Edit
          </button>
        </div>
        <div>
          {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
        </div>
      </form>
    </div>
  );
};
