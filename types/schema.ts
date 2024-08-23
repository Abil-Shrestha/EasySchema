export type SchemaFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "object"
  | "array"
  | "enum"
  | "union";

export interface SchemaFieldValues {
  id: string;
  name: string;
  type: SchemaFieldType;
  isOptional?: boolean;
  description?: string;
  min?: number;
  max?: number;
  regex?: string;
  fields?: SchemaFieldValues[];
  enumValues?: string[];
}

export interface SchemaStore {
  schema: SchemaFieldValues[];
  copied: boolean;
  addField: (parentId?: string) => void;
  updateField: (
    fieldId: string,
    key: keyof SchemaFieldValues,
    value: any,
  ) => void;
  removeField: (fieldId: string) => void;
  setCopied: (value: boolean) => void;
  reorderFields: (newOrder: SchemaFieldValues[]) => void
  reorderSubFields: (parentId: string, newOrder: SchemaFieldValues[]) => void
}
