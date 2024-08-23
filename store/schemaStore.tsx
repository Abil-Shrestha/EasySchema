import {create} from "zustand";
import {v4 as uuidv4} from "uuid";
import {SchemaFieldType, SchemaFieldValues, SchemaStore} from "@/types/schema";

export const useSchemaStore = create<SchemaStore>((set) => ({
  schema: [],
  copied: false,

  addField: (parentId?: string) =>
    set((state) => {
      const newField: SchemaFieldValues = {id: uuidv4(), name: "", type: "string"};

      const addFieldRecursive = (fields: SchemaFieldValues[]): SchemaFieldValues[] => {
        return fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              fields: [...(field.fields || []), newField],
            };
          }
          if (field.fields) {
            return {
              ...field,
              fields: addFieldRecursive(field.fields),
            };
          }
          return field;
        });
      };

      if (parentId) {
        return {
          schema: addFieldRecursive(state.schema),
        };
      }
      return {schema: [...state.schema, newField]};
    }),

  updateField: (fieldId: string, key: keyof SchemaFieldValues, value: any) =>
    set((state) => ({
      schema: state.schema.map((field) =>
        updateFieldRecursive(field, fieldId, key, value)
      ),
    })),

  reorderFields: (newOrder: SchemaFieldValues[]) => set({ schema: newOrder }),

  reorderSubFields: (parentId: string, newOrder: SchemaFieldValues[]) =>
    set((state) => ({
      schema: state.schema.map((field) =>
        field.id === parentId
          ? { ...field, fields: newOrder }
          : field.fields
          ? { ...field, fields: reorderSubFieldsRecursive(field.fields, parentId, newOrder) }
          : field
      ),
    })),

  removeField: (fieldId: string) =>
    set((state) => ({
      schema: removeFieldRecursive(state.schema, fieldId),
    })),

  setCopied: (value: boolean) => set({copied: value}),
}));

function updateFieldRecursive(
  field: SchemaFieldValues,
  fieldId: string,
  key: keyof SchemaFieldValues,
  value: any
): SchemaFieldValues {
  if (field.id === fieldId) {
    return {...field, [key]: value};
  }
  if (field.fields) {
    return {
      ...field,
      fields: field.fields.map((subField) =>
        updateFieldRecursive(subField, fieldId, key, value)
      ),
    };
  }
  return field;
}

function removeFieldRecursive(
  fields: SchemaFieldValues[],
  fieldId: string
): SchemaFieldValues[] {
  return fields
    .filter((field) => field.id !== fieldId)
    .map((field) => {
      if (field.fields) {
        return {...field, fields: removeFieldRecursive(field.fields, fieldId)};
      }
      return field;
    });
}

function reorderSubFieldsRecursive(
  fields: SchemaFieldValues[],
  parentId: string,
  newOrder: SchemaFieldValues[]
): SchemaFieldValues[] {
  return fields.map((field) => {
    if (field.id === parentId) {
      return { ...field, fields: newOrder };
    }
    if (field.fields) {
      return { ...field, fields: reorderSubFieldsRecursive(field.fields, parentId, newOrder) };
    }
    return field;
  });
}