import { IncludeOptions, Op } from 'sequelize';
import { GeneralFindOptions } from '../types/repositories.types';

export function resolveOptions<T, K>(
  options: GeneralFindOptions<T, K> | undefined,
  excludeFieldsParam: Array<keyof T>,
  relationsFunction: (relations: K[]) => IncludeOptions[],
) {
  const excludeFields = getExcludedFields(
    excludeFieldsParam,
    options?.includeFields ?? [],
    options?.includeAllFields,
  );

  const include = relationsFunction(options?.relations ?? []);
  const order = options?.order;

  return { excludeFields, include, order };
}

export function getExcludedFields<T>(
  excludeFields: Array<keyof T>,
  includeFields: Array<keyof T>,
  includeAllFields?: boolean,
) {
  return includeAllFields
    ? []
    : includeFields.length
      ? excludeFields.filter((field) => !includeFields.includes(field))
      : excludeFields;
}

export const search = <T>(fields: Array<keyof T>[], term: string) => ({
  or: fields.map((field) => ({ [field as any]: ilike(`%${term}%`) })),
});

const createOperator = (op: symbol) => (value: any) => ({ [op]: value });

export const or = createOperator(Op.or);
export const like = createOperator(Op.like);
export const ilike = createOperator(Op.iLike);
export const inArray = createOperator(Op.in);
export const notIn = createOperator(Op.notIn);
export const gt = createOperator(Op.gt);
export const eq = createOperator(Op.eq);
export const gte = createOperator(Op.gte);
export const lt = createOperator(Op.lt);
export const lte = createOperator(Op.lte);
