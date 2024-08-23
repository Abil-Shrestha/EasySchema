"use client";

import {Button} from "@/components/ui/button";

import {useSchemaStore} from "@/store/schemaStore";
import SchemaField from "@/components/SchemaField";
import SchemaOutput from "@/components/SchemaOutput";
import DynamicSchemaField from "@/components/DynamicSchemaField";
import {motion, Reorder, AnimatePresence} from "framer-motion";

export default function Component() {
  const {schema, copied, addField, reorderFields} = useSchemaStore();

  return (
    <div className="p-6 max-w-3xl w-full mx-auto">
      <h1 className="text-3xl font-semibold mb-6 font-sans">
        Prompt Schema Builder
      </h1>

      <div className=" p-2 mb-4 ">
        <Reorder.Group axis="y" values={schema} onReorder={reorderFields}>
          <AnimatePresence initial={false} mode="popLayout">
            {schema.map((field) => (
              <motion.div
                key={field.id}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  filter: "blur(6px)",
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  height: "auto",
                }}
                exit={{opacity: 0, scale: 0.8, filter: "blur(6px)", height: 0}}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  filter: {ease: "easeInOut", duration: 0.3},
                }}
              >
                <Reorder.Item key={field.id} value={field} dragListener={false}>
                  <DynamicSchemaField field={field} />
                </Reorder.Item>
              </motion.div>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mb-6 mt-6">
          <Button onClick={() => addField()} className="w-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Button>
        </div>
      </div>
      <div>
        <SchemaOutput />
      </div>
    </div>
  );
}
