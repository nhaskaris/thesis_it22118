import { Project } from "@/types/pages"
import { DeleteButton } from "./DeleteButton";

//for each work package, we want to display the title of the work package and the interval of the work package
const ProjectCard: React.FC<{ project: Project}> = ({ project }) => {
  const formatUnixTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  const handleDelete = async (id: string) => {
    console.log('delete project with id:', id);
  }

  //need to create a new use client element for deleting a project
  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <h1 className="text-xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-300 mb-4">{project.description}</p>
      {project.wps && (
        <div>
          <h2 className="text-lg font-semibold">Work Packages:</h2>
          {project.wps.map((wp) => (
            <div key={wp._id}>
              <p className="font-semibold">{wp.title}</p>
              <ul className="list-disc pl-5">
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Interval:</h2>
          <p>
            {formatUnixTimestamp(project.interval.startDate)} -{' '}
            {formatUnixTimestamp(project.interval.endDate)}
          </p>
        </div>
      </div>
      <DeleteButton id={project._id!} url="/projects/api"/>
    </div>
  );
};

export default ProjectCard;

  
  