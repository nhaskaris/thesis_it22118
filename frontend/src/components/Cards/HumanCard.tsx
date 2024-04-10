import { Human } from "@/types/pages";
import { DeleteButton } from "../DeleteButton";
import { UpdateButton } from "../UpdateButton";

const HumanCard: React.FC<{ human: Human }> = ({ human }) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-400 ">Human Entry</div>
          </div>
          <div className="flex items-center mb-2">
              <div className="text-sm font-medium text-gray-400 mr-2">Name:</div>
              <div className="text-sm font-semibold text-gray-200">{human.firstName + ' ' + human.lastName}</div>
          </div>
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-400 mr-2">VAT:</div>
            <div className="text-sm font-semibold text-gray-200">{human.vat}</div>
          </div>
      </div>
      <div className="flex justify-between mb-4">
          <UpdateButton data={human} url="/people/updateHuman"/>
          <DeleteButton id={human._id!} endpoint="humans" />
      </div>
      
    </div>
  );
};

export default HumanCard;