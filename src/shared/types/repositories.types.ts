import {
  BindOrReplacements,
  FindAttributeOptions,
  LOCK,
  Order,
  Transaction,
  WhereOptions,
} from 'sequelize';

// export type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
//   {
//     [K in Keys]: Required<Pick<T, K>>;
//   }[Keys];

export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T] &
  Partial<T>;

// export type AtLeastOne<T> = {
//   [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
// }[keyof T];

export type FiltersOrOperators<T> = WhereOptions<T>;

export type PaginationInput = {
  page: number;
  limit: number;
};

export type PaginationWithSearch = PaginationInput & { search?: string };

// export type GeneralFindOptions<T, K> = OperationOptions & {
//   includeAllFields?: boolean;
//   includeFields?: Array<keyof T>;
//   excludeFields?: Array<keyof T>;
//   relations?: K[];
//   order?: Order;
// };

export type FieldSelection<T> =
  | { includeAllFields: true; excludeFields?: never; includeFields?: never }
  | {
      includeAllFields?: false;
      excludeFields?: Array<keyof T>;
      includeFields?: Array<keyof T>;
    };

export type GeneralFindOptions<T, K> = OperationOptions &
  FieldSelection<T> & {
    relations?: K[];
    order?: Order;
    attributes?: FindAttributeOptions;
    replacements?: BindOrReplacements;
  };

export type OperationOptions = {
  transaction?: Transaction;
  lock?: LOCK;
  limit?: number;
};

export type FilterOrder = Order;
