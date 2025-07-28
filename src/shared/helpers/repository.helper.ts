import { IncludeOptions } from 'sequelize';

export function getExcludedFields<T>(
  excludeFields: Array<keyof T>,
  includeFields: Array<keyof T>,
) {
  return includeFields.length
    ? excludeFields.filter((field) => includeFields.includes(field))
    : excludeFields;
}
