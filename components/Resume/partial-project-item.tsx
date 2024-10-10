import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PartialProject {
  id?: number;
  name?: string;
  description?: string[];
  technologies?: string;
}

interface PartialProjectItemProps {
  project: PartialProject;
}

const PartialProjectItem: React.FC<PartialProjectItemProps> = ({ project }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{project.name || "Project Name"}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => null}
          className="text-red-500 hover:text-red-700 print:hidden"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      {project.description && project.description.length > 0 ? (
        <ul className="list-disc list-inside mt-1">
          {project.description.map((item, index) => (
            <li key={index} className="ml-4">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-gray-400">Project description</p>
      )}
      {project.technologies ? (
        <p className="mt-1 text-sm italic">{project.technologies}</p>
      ) : (
        <p className="mt-1 text-sm italic text-gray-400">Technologies used</p>
      )}
    </div>
  );
};

export default PartialProjectItem;