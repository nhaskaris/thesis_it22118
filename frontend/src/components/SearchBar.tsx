'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps<T> {
    items: any[];
    endpoint: string;
    placeholder: string;
}

function SearchBar<T>({ items, endpoint, placeholder}: SearchBarProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        router.push(`/${endpoint}?q=` + event.target.value);
    };

    placeholder = 'Search ' + placeholder;
    return (
        (items && items.length > 0 || (searchTerm != ' ' && searchTerm != '')) && (
            <div className="flex justify-center items-center mb-4">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-md shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
            </div>
        )
    );
}

export default SearchBar;