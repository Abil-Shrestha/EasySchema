import {Button} from "@/components/ui/button";
import EditableDiv from "@/components/Resume/EditableDiv";
import {Trash2} from "lucide-react";

const ProjectItem = ({project, updateProject, removeProject}) => (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <EditableDiv
          value={project.name}
          onChange={(value) => updateProject({...project, name: value})}
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
      <EditableDiv
        value={project.description}
        onChange={(value) => updateProject({...project, description: value})}
        placeholder="Project description"
        className="mt-1"
      />
      <EditableDiv
        value={project.technologies}
        onChange={(value) => updateProject({...project, technologies: value})}
        placeholder="Technologies used"
        className="mt-1 text-sm italic"
      />
    </div>
  );

  export  default ProjectItem;