import EditableDiv from "@/components/Resume/EditableDiv";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";

const ProjectItem = ({project}) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <EditableDiv
        value={project?.name}
        onChange={() => null}
        placeholder="Project Name"
        className="font-bold"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => null}
        className="text-red-500 hover:text-red-700 print:hidden"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
    <EditableDiv
      value={project?.description}
      onChange={() => null}
      placeholder="Project description"
      className="mt-1"
    />
    <EditableDiv
      value={project?.technologies}
      onChange={() => null}
      placeholder="Technologies used"
      className="mt-1 text-sm italic"
    />
  </div>
);

export default ProjectItem;
