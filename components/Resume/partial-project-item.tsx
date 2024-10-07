import type React from "react";

interface Project {
  id?: number;
  name?: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

interface PartialProjectItemProps {
  project: Project;
}

const PartialProjectItem: React.FC<PartialProjectItemProps> = ({project}) => {
  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-md">
      <h3 className="font-semibold text-lg">
        {project?.name || "Project Name"}
      </h3>
      <p className="text-sm mt-1">
        {project.description || "Project description"}
      </p>
      {project.technologies && project?.technologies?.length > 0 && (
        <div className="mt-2">
          <span className="text-sm font-semibold">Technologies: </span>
          <span className="text-sm">{project?.technologies?.join(", ")}</span>
        </div>
      )}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
        >
          Project Link
        </a>
      )}
    </div>
  );
};

export default PartialProjectItem;
