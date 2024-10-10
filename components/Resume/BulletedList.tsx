import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Download, Plus, Trash2} from "lucide-react";
import EditableDiv from "@/components/Resume/EditableDiv";

const BulletedList = ({items, onItemChange, onAddItem, onRemoveItem}) => {
    return (
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index} className="group">
            <div className="flex items-start ">
              <EditableDiv
                value={item}
                onChange={(value) => onItemChange(index, value)}
                placeholder="Job responsibility"
                className="flex-grow leading-5 bg-yellow-100"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
                className="ml-2 text-red-500 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity print:hidden"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </li>
        ))}
        <li className="print:hidden list-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddItem}
            className="text-blue-500 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </li>
      </ul>
    );
  };
  export default BulletedList;