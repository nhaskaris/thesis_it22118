import { Project } from "@/types/pages"

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const formatUnixTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <h1 className="text-xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-300 mb-4">{project.description}</p>
      {project.wps && (
        <div>
          <h2 className="text-lg font-semibold">Work Packages:</h2>
          <ul className="list-disc pl-5">
            {project.wps.map((wp) => (
              <li key={wp._id}>{wp.title}</li>
            ))}
          </ul>
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
    </div>
  );
};

export default ProjectCard;

  
  