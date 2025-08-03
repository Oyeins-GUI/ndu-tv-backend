import { IncludeOptions, Op } from 'sequelize';

export function getExcludedFields<T>(
  excludeFields: Array<keyof T>,
  includeFields: Array<keyof T>,
) {
  return includeFields.length
    ? excludeFields.filter((field) => includeFields.includes(field))
    : excludeFields;
}

export const search = (fields: string[], term: string) => ({
  or: fields.map((field) => ({ [field]: like(`%${term}%`) })),
});

const createOperator = (op: symbol) => (value: any) => ({ [op]: value });

export const or = createOperator(Op.or);
export const like = createOperator(Op.like);
export const ilike = createOperator(Op.iLike);
export const inArray = createOperator(Op.in);
export const notIn = createOperator(Op.notIn);
export const gt = createOperator(Op.gt);
export const gte = createOperator(Op.gte);
export const lt = createOperator(Op.lt);
export const lte = createOperator(Op.lte);
