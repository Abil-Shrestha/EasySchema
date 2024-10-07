import React from "react"

interface WorkExperience {
  id?: number
  company?: string
  location?: string
  title?: string
  date?: string
  description?: string[]
}

interface WorkExperienceItemProps {
  experience: WorkExperience
}

const PartialWorkExperienceItem: React.FC<WorkExperienceItemProps> = ({ experience }) => {
  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-md">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{experience.company || 'Company'}</h3>
          <span className="text-sm text-start">{experience.location || 'Location'}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="italic">{experience.title || 'Job Title'}</span>
          <span className="text-sm">{experience.date || 'Date Range'}</span>
        </div>
      </div>
      <ul className="list-disc list-inside mt-2 space-y-1">
        {experience.description?.map((item, index) => (
          <li key={index} className="text-sm">{item}</li>
        )) || ""}
      </ul>
    </div>
  )
}

export default PartialWorkExperienceItem