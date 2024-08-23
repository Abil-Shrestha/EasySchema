export const generateZodSchema = (fields: any): string => {
  return `z.object({
${fields
  .map((field) => {
    let fieldSchema = `z.${field.type}()`;

    if (field.type === "string" && field.regex) {
      fieldSchema = `z.string().regex(/${field.regex}/)`;
    } else if (field.type === "number") {
      if (field.min !== undefined) fieldSchema = `z.number().min(${field.min})`;
      if (field.max !== undefined)
        fieldSchema = `${fieldSchema}.max(${field.max})`;
    } else if (field.type === "object" && field.fields) {
      fieldSchema = generateZodSchema(field.fields);
    } else if (field.type === "array" && field.fields) {
      fieldSchema = `z.array(${generateZodSchema(field.fields)})`;
    } else if (field.type === "enum" && field.enumValues) {
      fieldSchema = `z.enum([${field.enumValues
        .map((v) => `'${v}'`)
        .join(", ")}])`;
    }

    if (field.description)
      fieldSchema = `${fieldSchema}.describe("${field.description}")`;
    if (field.isOptional) fieldSchema = `${fieldSchema}.optional()`;

    return `  ${field.name}: ${fieldSchema}`;
  })
  .join(",\n")}
})`;
};

export const generateJSONSchema = (fields: any): string => {
  return JSON.stringify(
    {
      type: "object",
      properties: fields.reduce((acc, field) => {
        acc[field.name] = {
          type: field.type,
          description: field.description,
          ...(field.isOptional && { optional: true }),
          ...(field.type === "string" &&
            field.regex && { pattern: field.regex }),
          ...(field.type === "number" && {
            ...(field.min !== undefined && { minimum: field.min }),
            ...(field.max !== undefined && { maximum: field.max }),
          }),
          ...(field.type === "object" &&
            field.fields && {
              properties: JSON.parse(generateJSONSchema(field.fields)),
            }),
          ...(field.type === "array" &&
            field.fields && {
              items: JSON.parse(generateJSONSchema(field.fields)),
            }),
          ...(field.type === "enum" &&
            field.enumValues && { enum: field.enumValues }),
        };
        return acc;
      }, {}),
    },
    null,
    2,
  );
};
