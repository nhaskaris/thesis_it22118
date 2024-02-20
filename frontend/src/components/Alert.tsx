import * as React from 'react';

interface AlertInfo {
    message: string;
    severity: string;
}

interface Colors {
    [key: string]: string | undefined
}

const SeverityColors: Colors = {
    critical : 'bg-red-100',
    success : 'bg-green-400',
    info : 'bg-blue-400'
} 

export default function Alert({message, severity}: AlertInfo) {
    return(
        <div className="absolute bottom-0 left-0 text-center py-4 lg:px-4">
            <div className={`p-2 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex ${SeverityColors[severity]}`} id='container' role="alert">
                <span className="flex rounded-full uppercase px-2 py-1 text-xl font-bold mr-3">⚠️</span>
                <span className="font-semibold mr-2 text-left flex-auto text-red-700">{message}</span>
            </div>
        </div>
    )
}