import { Human } from "@/types/pages";
import { DeleteButton } from "./DeleteButton";

const HumanCard: React.FC<{ human: Human }> = ({ human }) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <h1 className="text-xl font-bold mb-2">{human.firstName} {human.lastName}</h1>
      <p className="text-gray-200 mb-2"><strong>VAT:</strong> {human.vat}</p>
      <DeleteButton id={human._id!} endpoint="humans" />
    </div>
  );
};

export default HumanCard;