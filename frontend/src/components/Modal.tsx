'use client';

import { useState } from 'react';
import { AddProjectForm } from './ProjectsForm';
import { Project } from '@/types/pages';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-75"></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl relative z-10">
          <button
            className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900"
            onClick={handleClose}
          >
            Close
          </button>
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddNewButton () {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  //need to push the request to nextjs api that will then push the request to the backend
  const handleAddProject = async (newProject: Project) => {
    const res = await fetch('http://localhost:8080/users/insertInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newProject),
    }).catch(err => {
      return err.statusText;
    });

    if(!res) {
      return;
    }

    if (res.ok) {
      closeModal();
    }

    console.log(res.statusText)
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={openModal}
        className="mb-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Project
      </button>
      {isOpen && (
        <Modal onClose={closeModal}>
          <AddProjectForm onSubmit={handleAddProject} />
        </Modal>
      )}
    </div>
  );
};