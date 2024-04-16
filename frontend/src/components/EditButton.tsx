import { Contract, Human, Project, Timesheet } from "@/types/pages";
import Link from "next/link";

interface EditButtonProps {
    data: Project | Human | Contract | Timesheet;
    url: string;
}

export const EditButton = (props: EditButtonProps) => {
    return (
        <Link
          href={{
              pathname: props.url,
              query: {
                  data: JSON.stringify(props.data)
              }
          }}
          className="float-right mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M13.293 3.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414-1.414l8-8zM13 5l2-2-1-1-2 2V2h-1v4h4V5z" clipRule="evenodd"/>
            <path fillRule="evenodd" d="M5.5 12.793L7.707 10.5l-1.414-1.414-2.293 2.293a1 1 0 000 1.414l4 4a1 1 0 001.414 0l2.293-2.293-1.414-1.414-2.207 2.207L5.5 12.793z" clipRule="evenodd"/>
          </svg>
          Edit
        </Link>
      );  
}