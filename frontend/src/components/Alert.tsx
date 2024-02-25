import * as React from 'react';
import { AlertInfo } from '@/types/pages';

interface Colors {
    [key: string]: string | undefined
}

const SeverityColors: Colors = {
    error: 'bg-red-100',
    success: 'bg-green-400',
    info: 'bg-blue-400'
} 

const SeverityText: Colors = {
    error: 'text-red-700',
    success: 'text-green-700',
    info: 'text-blue-700'
}

const Alert: React.FC<AlertInfo> = ({ message, severity, visible, onClose }) => {
    return visible ? (
        <div className="absolute bottom-0 left-0 text-center py-4 lg:px-4">
            <div className={`p-2 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex ${SeverityColors[severity]}`} id='container' role="alert">
                <span className="flex rounded-full uppercase px-2 py-1 text-xl font-bold mr-3">⚠️</span>
                <span className={`font-semibold mr-2 text-left flex-auto ${SeverityText[severity]}`}>{message}</span>
                <button onClick={onClose} className={`${SeverityText[severity]} hover:text-white focus:outline-none ml-3`}>&times;</button>
            </div>
        </div>
    ) : null;
}

export default Alert;
