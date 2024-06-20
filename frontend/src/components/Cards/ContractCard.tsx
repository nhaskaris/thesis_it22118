import React from "react";
import { DeleteButton } from "../DeleteButton"; // Assuming DeleteButton is already defined
import { Contract } from "@/types/pages";
import { EditButton } from "../EditButton";
import { formatUnixTimestamp, formatUnixTimestampDuration } from "@/Utils/formatTimestamp";

const ContractCard: React.FC<{contract: Contract}> = ({ contract }) => {
    console.log(contract);
  return (
        <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
          <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-400 ">Contract Entry</div>
                  <div className="text-sm text-gray-200">{formatUnixTimestamp(contract.interval.startDate)} - {formatUnixTimestampDuration(Number(contract.interval.startDate), contract.interval.duration)}</div>
              </div>
              <div className="flex items-center mb-2">
                  <div className="text-sm font-medium text-gray-400 mr-2">Title:</div>
                  <div className="text-sm font-semibold text-gray-200">{contract.project.title}</div>
              </div>
              <div className="flex items-center mb-2">
                  <div className="text-sm font-medium text-gray-400 mr-2">Human:</div>
                  <div className="text-sm font-semibold text-gray-200">{contract.human.firstName} {contract.human.lastName}</div>
              </div>
              <div className="items-center mb-2">
                  <div className="text-sm font-medium text-gray-400 mr-2">Work Packages:</div>
                  {contract.wps.map((wp, index) => (
                    <div key={wp._id} className="text-sm font-semibold text-gray-200">
                      {wp.title}
                      {index < contract.wps.length - 1 ? ", " : ""}
                    </div>
                  ))}
              </div>
              <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-400 mr-2">Hourly Rate:</div>
                  <div className="text-sm font-semibold text-gray-200">€{contract.hourlyRate}</div>
              </div>
              <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-400 mr-2">Total Cost:</div>
                  <div className="text-sm font-semibold text-gray-200">€{contract.totalCost}</div>
              </div>
              <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-400 mr-2">Id:</div>
                  <div className="text-sm font-semibold text-gray-200">{contract._id}</div>
              </div>
          </div>
          
          <div className="flex justify-between mb-4">
              <EditButton data={contract} url="/contracts/updateContract"/>        
              <DeleteButton id={contract._id!} endpoint="contracts" />
          </div>
        </div>
  );
};

export default ContractCard;