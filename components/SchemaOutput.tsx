import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateZodSchema, generateJSONSchema } from "@/lib/generators";
import { PlusIcon, TrashIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useSchemaStore } from "@/store/schemaStore";
import { Button } from "@/components/ui/button";

const SchemaOutput = () => {
  const { schema, copied, addField, updateField, removeField, setCopied } =
    useSchemaStore();

  const copySchema = (schemaType: "zod" | "json") => {
    const schemaString =
      schemaType === "zod"
        ? generateZodSchema(schema)
        : generateJSONSchema(schema);
    navigator.clipboard.writeText(schemaString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tabs defaultValue="zod">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="zod">Zod Schema</TabsTrigger>
        <TabsTrigger value="json">JSON Schema</TabsTrigger>
      </TabsList>
      <TabsContent value="zod">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Generated Zod Schema:</h2>
          <Button
            onClick={() => copySchema("zod")}
            className="flex items-center space-x-2"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
        <pre className="bg-muted p-6 rounded-lg overflow-x-auto">
          <code>{generateZodSchema(schema)}</code>
        </pre>
      </TabsContent>
      <TabsContent value="json">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Generated JSON Schema:</h2>
          <Button
            onClick={() => copySchema("json")}
            className="flex items-center space-x-2"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
        <pre className="bg-muted p-6 rounded-lg overflow-x-auto">
          <code>{generateJSONSchema(schema)}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
};

export default SchemaOutput;
