import { Project } from "@/types/pages"
import { DeleteButton } from "../DeleteButton";

//for each work package, we want to display the title of the work package and the interval of the work package
const ProjectCard: React.FC<{ project: Project}> = ({ project }) => {
  const formatUnixTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      

      <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-400 ">Project Entry</div>
              <div className="text-sm text-gray-200">{formatUnixTimestamp(project.interval.startDate)} -{' '} {formatUnixTimestamp(project.interval.endDate)}</div>
          </div>
          <div className="flex items-center mb-2">
              <div className="text-sm font-medium text-gray-400 mr-2">Title:</div>
              <div className="text-sm font-semibold text-gray-200">{project.title}</div>
          </div>
          <div className="flex items-center mb-2">
              <div className="text-sm font-medium text-gray-400 mr-2">Description:</div>
              <div className="text-sm font-semibold text-gray-200">{project.description}</div>
          </div>
          <div className="items-center mb-2">
              <div className="text-sm font-medium text-gray-400 mr-2">Work Packages:</div>
              {project.wps && (
                <div>
                  {project.wps.map((wp) => (
                      <div key={wp._id}>
                        <p className="font-semibold text-sm">{wp.title}</p>
                        <ul className="list-disc pl-5 text-sm">
                          {wp.activeIntervals.map((interval, index) => (
                            <li key={index}>
                              Interval {index + 1}: {formatUnixTimestamp(interval.startDate)} - {formatUnixTimestamp(interval.endDate)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
          </div>
      </div>

      <DeleteButton id={project._id!} endpoint="projects"/>
    </div>
  );
};

export default ProjectCard;

  
  