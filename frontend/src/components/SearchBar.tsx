'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps<T> {
    items: any[];
    endpoint: string;
}

function SearchBar<T>({ items, endpoint}: SearchBarProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(items);

    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        router.push(`/${endpoint}?q=` + event.target.value);
    };

    return (
        items.length > 0 && (
            <div className="flex justify-center items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-md shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
            </div>
        )
    );
}

export default SearchBar;