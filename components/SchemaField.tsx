import { SchemaFieldType, SchemaFieldValues } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, TrashIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useSchemaStore } from "@/store/schemaStore";
import { cn } from "@/lib/utils";

const SchemaField = ({
  field,
  depth = 0,
}: {
  field: SchemaFieldValues;
  depth?: number;
}) => {
  const { updateField, addField, removeField } = useSchemaStore();

  return (
    <div
      key={field.id}
      className={cn(
        `ml-${depth * 5} shadow-elevationLight w-full rounded-xl p-8 gap-4 mt-4 flex flex-col justify-center items-center`,
      )}
    >
      <Input
        value={field.name}
        onChange={(e) => updateField(field.id, "name", e.target.value)}
        className="w-full rounded-xl"
      />
      <Select
        value={field.type}
        onValueChange={(value) =>
          updateField(field.id, "type", value as SchemaFieldType)
        }
      >
        <SelectTrigger className="w-full rounded-xl ">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent className="font-sans">
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
      {(field.type === "object" || field.type === "array") && (
        <Button onClick={() => addField(field.id)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Sub-field
        </Button>
      )}

      <Input
        value={field.description || ""}
        onChange={(e) => updateField(field.id, "description", e.target.value)}
        placeholder="Description"
        className="w-full rounded-xl"
      />

      {field.type === "string" && (
        <Input
          value={field.regex || ""}
          onChange={(e) => updateField(field.id, "regex", e.target.value)}
          placeholder="Regex Optional"
          className="w-full rounded-xl"
        />
      )}
      {field.type === "number" && (
        <>
          <Input
            type="number"
            value={field.min}
            onChange={(e) =>
              updateField(
                field.id,
                "min",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="Min"
            className="w-24"
          />
          <Input
            type="number"
            value={field.max}
            onChange={(e) =>
              updateField(
                field.id,
                "max",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="Max"
            className="w-24"
          />
        </>
      )}
      {field.type === "enum" && (
        <Input
          value={field.enumValues?.join(", ") || ""}
          onChange={(e) =>
            updateField(
              field.id,
              "enumValues",
              e.target.value.split(",").map((v) => v.trim()),
            )
          }
          placeholder="Enum values (comma-separated)"
          className="w-full"
        />
      )}
      {field.fields &&
        field.fields.map((subField) => (
          <SchemaField key={subField.id} field={subField} depth={depth + 1} />
        ))}
      <div className="flex gap-4">
        <Button onClick={() => removeField(field.id)}>
          <TrashIcon className=" h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`optional-${field.id}`}
            checked={field.isOptional}
            onCheckedChange={(checked) =>
              updateField(field.id, "isOptional", checked)
            }
          />
          <Label htmlFor={`optional-${field.id}`}>Optional</Label>
        </div>
      </div>
    </div>
  );
};

export default SchemaField;
