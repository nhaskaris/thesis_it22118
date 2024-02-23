import * as React from 'react';
import { AlertInfo } from '@/types/pages';

interface Colors {
    [key: string]: string | undefined
}

const SeverityColors: Colors = {
    critical: 'bg-red-100',
    success: 'bg-green-400',
    info: 'bg-blue-400'
} 

export default function Alert({ message, severity }: AlertInfo) {
    // State to manage whether the alert is visible or not
    const [visible, setVisible] = React.useState(true);

    // Function to handle the timeout and hide the alert after 5 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000); // Hide after 5 seconds

        // Clean up the timer when the component unmounts or the alert becomes hidden
        return () => clearTimeout(timer);
    }, []);

    // Render the alert only if it's visible
    return visible ? (
        <div className="absolute bottom-0 left-0 text-center py-4 lg:px-4">
            <div className={`p-2 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex ${SeverityColors[severity]}`} id='container' role="alert">
                <span className="flex rounded-full uppercase px-2 py-1 text-xl font-bold mr-3">⚠️</span>
                <span className="font-semibold mr-2 text-left flex-auto text-red-700">{message}</span>
            </div>
        </div>
    ) : null;
}
