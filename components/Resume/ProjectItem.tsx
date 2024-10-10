import React from "react";
import { Button } from "@/components/ui/button";
import EditableDiv from "@/components/Resume/EditableDiv";
import BulletedList from "@/components/Resume/BulletedList";
import { Trash2 } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string[];
  technologies: string;
}

interface ProjectItemProps {
  project: Project;
  updateProject: (updatedProject: Project) => void;
  removeProject: (id: number) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  updateProject,
  removeProject,
}) => {
  const updateDescription = (index: number, value: string) => {
    const newDescription = [...project.description];
    newDescription[index] = value;
    updateProject({ ...project, description: newDescription });
  };

  const addDescriptionItem = () => {
    updateProject({
      ...project,
      description: [...project.description, ""],
    });
  };

  const removeDescriptionItem = (index: number) => {
    const newDescription = project.description.filter((_, i) => i !== index);
    updateProject({ ...project, description: newDescription });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <EditableDiv
          value={project.name}
          onChange={(value) => updateProject({ ...project, name: value })}
          placeholder="Project Name"
          className="font-bold"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeProject(project.id)}
          className="text-red-500 hover:text-red-700 print:hidden"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      <BulletedList
        items={project.description}
        onItemChange={updateDescription}
        onAddItem={addDescriptionItem}
        onRemoveItem={removeDescriptionItem}
      />
      <EditableDiv
        value={project.technologies}
        onChange={(value) => updateProject({ ...project, technologies: value })}
        placeholder="Technologies used"
        className="mt-1 text-sm italic"
      />
    </div>
  );
};

export default ProjectItem;