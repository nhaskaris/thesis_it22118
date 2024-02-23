'use client';

interface DeleteButtonProps {
    id: string;
    url: string;
}

export const DeleteButton = (props: DeleteButtonProps) => {
    const handleDelete = async() => {
        const res = await fetch(props.url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: props.id}),
        })

        //reload the page
        window.location.reload();
    }

    return (
        <button
          className="float-right mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={handleDelete}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h2a1 1 0 011 1v1h1a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h1V4zm7 2H7v1h6V6zm3 3H5v9h12V9zM9 11v5h2v-5H9zm4 0v5h2v-5h-2z" clipRule="evenodd" />
          </svg>
          Delete
        </button>
      );
      
}