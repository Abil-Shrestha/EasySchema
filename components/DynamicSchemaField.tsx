"use client";

import React, {useState, useRef, useCallback, useEffect} from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  Reorder,
  useDragControls,
} from "framer-motion";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GripVertical,
} from "lucide-react";
import {useSchemaStore} from "@/store/schemaStore";
import {cn} from "@/lib/utils";
import {SchemaFieldType, SchemaFieldValues} from "@/types/schema";

const transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

const DynamicSchemaField = ({
  field,
  depth = 0,
}: {
  field: SchemaFieldValues;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState<string | null>("basic");
  const {updateField, addField, removeField, reorderSubFields} =
    useSchemaStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      toolbarRef.current &&
      !toolbarRef.current.contains(event.target as Node) &&
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setActive(null);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const ITEMS = [
    {
      id: "basic",
      label: "Basic",
      content: (
        <>
          <Input
            value={field.name}
            onChange={(e) => updateField(field.id, "name", e.target.value)}
            placeholder="Field name"
            className="w-full rounded-xl mb-2"
          />
          <div ref={selectRef}>
            <Select
              value={field.type}
              onValueChange={(value) =>
                updateField(field.id, "type", value as SchemaFieldType)
              }
            >
              <SelectTrigger className="w-full rounded-xl mb-2">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="font-mono" ref={selectRef}>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="object">Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="enum">Enum</SelectItem>
                <SelectItem value="union">Union</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ),
    },
    {
      id: "description",
      label: "Description",
      content: (
        <Input
          value={field.description || ""}
          onChange={(e) => updateField(field.id, "description", e.target.value)}
          placeholder="Description"
          className="w-full rounded-xl"
        />
      ),
    },
    {
      id: "constraints",
      label: "Constraints",
      content: (
        <>
          {field.type === "string" && (
            <Input
              value={field.regex || ""}
              onChange={(e) => updateField(field.id, "regex", e.target.value)}
              placeholder="Regex ?"
              className="w-full rounded-xl mb-2"
            />
          )}
          {field.type === "number" && (
            <div className="flex space-x-2 mb-2">
              <Input
                type="number"
                value={field.min}
                onChange={(e) =>
                  updateField(
                    field.id,
                    "min",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Min"
                className="w-1/2"
              />
              <Input
                type="number"
                value={field.max}
                onChange={(e) =>
                  updateField(
                    field.id,
                    "max",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Max"
                className="w-1/2"
              />
            </div>
          )}
          {field.type === "enum" && (
            <Input
              value={field.enumValues?.join(", ") || ""}
              onChange={(e) =>
                updateField(
                  field.id,
                  "enumValues",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              placeholder="Enum values (comma-separated)"
              className="w-full rounded-xl mb-2"
            />
          )}
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id={`optional-${field.id}`}
              checked={field.isOptional}
              onCheckedChange={(checked) =>
                updateField(field.id, "isOptional", checked)
              }
            />
            <Label htmlFor={`optional-${field.id}`}>Optional</Label>
          </div>
        </>
      ),
    },
  ];

  return (
    <MotionConfig transition={transition}>
      <Reorder.Item
        value={field}
        className="w-full"
        dragListener={false}
        dragControls={dragControls}
      >
        <motion.div
          layout
          ref={containerRef}
          className={cn(
            "w-full rounded-xl px-4 pt-4 gap-4 mb-4",
            "bg-white dark:bg-gray-800",
            "shadow-elevationLight dark:shadow-inner-shadow-dark-sm",
            `ml-${depth * 4}`
          )}
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: "auto"}}
          exit={{opacity: 0, height: 0}}
        >
          <motion.div layout className="flex items-center mb-2">
            <h3 className="text-lg font-semibold flex-grow">
              {field.name || "New Field"}
            </h3>
            <GripVertical
              className="mr-2 cursor-move stroke-neutral-400/80"
              onPointerDown={(e) => dragControls.start(e)}
            />
          </motion.div>

          <AnimatePresence initial={false} mode="wait">
            {isOpen && (
              <motion.div
                key="content"
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: "auto"}}
                exit={{opacity: 0, height: 0}}
                transition={{duration: 0.3, ease: "easeInOut"}}
              >
                <div className="space-y-4 mb-4" ref={toolbarRef}>
                  <div className="flex space-x-2">
                    {ITEMS.map((item) => (
                      <Button
                        key={item.id}
                        variant={active === item.id ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setActive(active === item.id ? null : item.id)
                        }
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {active && (
                      <motion.div
                        key={active}
                        initial={{
                          opacity: 0,
                          height: "auto",
                          filter: "blur(6px)",
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          height: "auto",
                          filter: "blur(6px)",
                        }}
                        transition={{
                          opacity: {duration: 0.2},
                          height: {duration: 0.2},
                          filter: {duration: 0.2},
                        }}
                      >
                        {ITEMS.find((item) => item.id === active)?.content}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end">
                    {(field.type === "object" || field.type === "array") && (
                      <Button onClick={() => addField(field.id)} size="sm">
                        <PlusIcon className="mr-2 h-4 w-4" /> Add Sub-field
                      </Button>
                    )}
                    <Button
                      onClick={() => removeField(field.id)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive hover:text-white"
                    >
                      <TrashIcon className="mr-2 h-4 w-4 hover:fill-white" />{" "}
                      Remove Field
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {field.fields && field.fields.length > 0 && (
            <Reorder.Group
              axis="y"
              values={field.fields}
              onReorder={(newOrder) => reorderSubFields(field.id, newOrder)}
            >
              <AnimatePresence initial={false}>
                {field.fields.map((subField) => (
                  <DynamicSchemaField
                    key={subField.id}
                    field={subField}
                    depth={depth + 1}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse field" : "Expand field"}
            className="w-full justify-center h-4 "
          >
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </Reorder.Item>
    </MotionConfig>
  );
};

export default DynamicSchemaField;
