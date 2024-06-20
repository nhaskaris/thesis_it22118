import { Project } from "@/types/pages"
import { DeleteButton } from "../DeleteButton";
import { EditButton } from "../EditButton";
import {formatUnixTimestamp, formatUnixTimestampDuration, formatUnixTimestampWpInterval} from "@/Utils/formatTimestamp"

//for each work package, we want to display the title of the work package and the interval of the work package
const ProjectCard: React.FC<{ project: Project}> = ({ project }) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-400 ">Project Entry</div>
              <div className="text-sm text-gray-200">{formatUnixTimestamp(project.interval.startDate)} -{' '} {formatUnixTimestampDuration(Number(project.interval.startDate), project.interval.duration)}</div>
          </div>
          <div className="flex items-center mb-2">
              <div className="text-sm font-medium text-gray-400 mr-2">ID:</div>
              <div className="text-sm font-semibold text-gray-200">{project.id}</div>
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
                              Interval {index + 1}: {formatUnixTimestampWpInterval(interval.startDate, project.interval.startDate)} - {formatUnixTimestampWpInterval(interval.startDate, project.interval.startDate, interval.duration)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
          </div>
      </div>
      <div className="flex justify-between mb-4">
          <EditButton data={project} url="/projects/updateProject"/>
          <DeleteButton id={project._id!} endpoint="projects"/>
      </div>
    </div>
  );
};

export default ProjectCard;

  
  