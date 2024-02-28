import React from "react";
import { DeleteButton } from "./DeleteButton"; // Assuming DeleteButton is already defined
import { Contract } from "@/types/pages";

const ContractCard: React.FC<{contract: Contract}> = ({ contract }) => {
  const formatUnixTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <h1 className="text-xl font-bold mb-2">
        {contract.project.title} - {contract.human.firstName} {contract.human.lastName}
      </h1>
      <p className="text-gray-200 mb-2">
        <strong>Duration:</strong> {formatUnixTimestamp(contract.duration.startDate)} - {formatUnixTimestamp(contract.duration.endDate)}
      </p>
      <p className="text-gray-200 mb-2">
        <strong>Work Packages:</strong>
        {contract.wps.map((wp, index) => (
          <span key={wp._id}>
            {wp.title}
            {index < contract.wps.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-gray-200">
          <strong>Hourly Rate:</strong> €{contract.hourlyRate}
        </p>
        <p className="text-gray-200">
          <strong>Total Cost:</strong> €{contract.totalCost}
        </p>
      </div>
      {/* Assuming endpoint and id are defined for contracts */}
      <DeleteButton id={contract._id!} endpoint="contracts" />
    </div>
  );
};

export default ContractCard;