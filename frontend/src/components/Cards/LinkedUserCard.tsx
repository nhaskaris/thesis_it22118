import { DeleteButton } from "../DeleteButton";

const LinkedUserCard: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-400 ">Linked User</div>
          </div>
          <div className="flex items-center mb-2">
              <div className="text-sm font-medium text-gray-400 mr-2">Email:</div>
              <div className="text-sm font-semibold text-gray-200">{email}</div>
          </div>
      </div>
      <DeleteButton id={email} endpoint="users/unlinkUser"  />
    </div>
  );
};

export default LinkedUserCard;