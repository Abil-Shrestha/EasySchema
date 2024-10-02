import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Download, Plus, Trash2} from "lucide-react";
import EditableDiv from "@/components/Resume/EditableDiv";
import BulletedList from "@/components/Resume/BulletedList";
import { WorkExperience } from '@/store/updatedResumeStore';

interface WorkExperienceItemProps {
  experience: WorkExperience;
  updateExperience: (updatedExperience: WorkExperience) => void;
  removeExperience: (id: number) => void;
}

const WorkExperienceItem :React.FC<WorkExperienceItemProps> = ({
  experience,
  updateExperience,
  removeExperience,
}) => {
  const updateDescription = (index, value) => {
    const newDescription = [...experience.description];
    newDescription[index] = value;
    updateExperience({...experience, description: newDescription});
  };

  const addDescriptionItem = () => {
    updateExperience({
      ...experience,
      description: [...experience.description, ""],
    });
  };

  const removeDescriptionItem = (index) => {
    const newDescription = experience.description.filter((_, i) => i !== index);
    updateExperience({...experience, description: newDescription});
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <EditableDiv
            value={experience.company}
            onChange={(value) =>
              updateExperience({...experience, company: value})
            }
            placeholder="Company"
            className="font-semibold text-lg"
          />
          <EditableDiv
            value={experience.location}
            onChange={(value) =>
              updateExperience({...experience, location: value})
            }
            placeholder="Location"
            className="text-sm text-start"
          />
        </div>
        <div className="flex justify-between items-start">
          <EditableDiv
            value={experience.title}
            onChange={(value) =>
              updateExperience({...experience, title: value})
            }
            placeholder="Job Title"
            className="italic"
          />
          <EditableDiv
            value={experience.date}
            onChange={(value) => updateExperience({...experience, date: value})}
            placeholder="Date Range"
            className="text-sm"
          />
        </div>
      </div>
      <BulletedList
        items={experience.description}
        onItemChange={updateDescription}
        onAddItem={addDescriptionItem}
        onRemoveItem={removeDescriptionItem}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeExperience(experience.id)}
        className="ml-5 text-red-500 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity print:hidden"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Remove Experience
      </Button>
    </div>
  );
};

export default WorkExperienceItem;
