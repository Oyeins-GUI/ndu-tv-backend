import { WhereOptions } from 'sequelize';

export type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  {
    [K in Keys]: Required<Pick<T, K>>;
  }[Keys];

export type Filters<T> = Partial<Record<keyof T, unknown>>;

export type FiltersOrOperators<T> = Filters<T> | WhereOptions<T>;

export type PaginationInput = {
  page: number;
  limit: number;
};
