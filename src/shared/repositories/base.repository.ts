// import { ModelCtor } from 'sequelize-typescript';
// import { IBaseRepository } from '../interfaces/base-repository.interface';
// import {
//   GeneralFindOptions,
//   FiltersOrOperators,
//   PaginationInput,
// } from '../types/repositories.types';
// import { BaseModel } from '../../db/models/base.model';
// import { FindOptions, IncludeOptions } from 'sequelize';
// import { resolveOptions } from '../helpers/repository.helper';
// import {
//   calculatePaginationLimit,
//   calculatePaginationOffset,
// } from '../responses/api-response';

// export abstract class BaseRepository<
//   TModel extends BaseModel,
//   TCreateInput,
//   TUpdateInput,
//   TRelations extends string | undefined = '',
// > implements IBaseRepository<TModel, TCreateInput, TUpdateInput, TRelations>
// {
//   constructor(private readonly model: ModelCtor<TModel>) {}

//   protected EXCLUDE_FIELDS: Array<keyof TModel> = ['deleted_at', 'updated_at'];

//   protected abstract computeRelations(
//     relations: TRelations[],
//   ): IncludeOptions[];

//   public async findById(
//     id: string,
//     options?: GeneralFindOptions<TModel, TRelations> | undefined,
//   ): Promise<TModel | null> {
//     const { excludeFields, include } = resolveOptions(
//       options,
//       this.EXCLUDE_FIELDS,
//       this.computeRelations,
//     );
//     const query: FindOptions<TModel> = {
//       attributes: {
//         exclude: excludeFields as string[],
//       },
//       include,
//     };
//     return this.model.findByPk(id, query);
//   }
//   public async findBy(
//     filters: FiltersOrOperators<TModel>,
//     options?: GeneralFindOptions<TModel, TRelations> | undefined,
//   ): Promise<TModel | null> {
//     const { excludeFields, include } = resolveOptions(
//       options,
//       this.EXCLUDE_FIELDS,
//       this.computeRelations,
//     );

//     const query: FindOptions<TModel> = {
//       where: {
//         ...filters,
//       },
//       attributes: {
//         exclude: excludeFields as string[],
//       },
//       include,
//       limit: 1,
//     };

//     return this.model.findOne(query);
//   }
//   public async findManyBy(
//     filters: FiltersOrOperators<TModel>,
//     options?:
//       | (GeneralFindOptions<TModel, TRelations> & PaginationInput)
//       | undefined,
//   ): Promise<TModel[]> {
//     const { excludeFields, include, order } = resolveOptions(
//       options,
//       this.EXCLUDE_FIELDS,
//       this.computeRelations,
//     );

//     const baseQuery: FindOptions<TModel> = {
//       where: {
//         ...filters,
//       },
//       attributes: {
//         exclude: excludeFields as string[],
//       },
//       include,
//       order,
//     };

//     let query = baseQuery;

//     if (options?.page && options.limit) {
//       query = {
//         ...baseQuery,
//         limit: calculatePaginationLimit(options?.limit ?? 10),
//         offset: calculatePaginationOffset(
//           options?.page ?? 1,
//           options?.limit ?? 10,
//         ),
//       };
//     }

//     return this.model.findAll(query);
//   }
//   public async delete(model: TModel): Promise<void> {
//     await model.destroy();
//   }
//   public async create(data: TCreateInput): Promise<TModel> {
//     return this.model.create(data as any);
//   }
//   public async updateByModel(
//     model: TModel,
//     data: TUpdateInput,
//   ): Promise<TModel> {
//     return model.update(data as any);
//   }
// }

import { ModelCtor } from 'sequelize-typescript';
import { IBaseRepository } from '../interfaces/base-repository.interface';
import {
  GeneralFindOptions,
  FiltersOrOperators,
  PaginationInput,
  OperationOptions,
} from '../types/repositories.types';
import { BaseModel } from '../../db/models/base.model';
import {
  CreateOptions,
  FindOptions,
  IncludeOptions,
  InstanceDestroyOptions,
  InstanceUpdateOptions,
} from 'sequelize';
import { resolveOptions } from '../helpers/repository.helper';
import {
  calculatePaginationLimit,
  calculatePaginationOffset,
} from '../responses/api-response';

export abstract class BaseRepository<
  TModel extends BaseModel,
  TCreateInput,
  TUpdateInput,
  TRelations extends string = '',
> implements IBaseRepository<TModel, TCreateInput, TUpdateInput, TRelations>
{
  constructor(private readonly model: ModelCtor<TModel>) {}

  protected EXCLUDE_FIELDS: Array<keyof TModel> = ['deleted_at', 'updated_at'];

  protected abstract computeRelations(
    relations: TRelations[],
  ): IncludeOptions[];

  public async findById(
    id: string,
    options?: GeneralFindOptions<TModel, TRelations> | undefined,
  ): Promise<TModel | null> {
    const { excludeFields, include } = resolveOptions(
      options,
      this.EXCLUDE_FIELDS,
      this.computeRelations,
    );
    const query: FindOptions<TModel> = {
      attributes: {
        exclude: excludeFields as string[],
      },
      include,
    };

    if (options?.transaction) {
      query.transaction = options.transaction;
    }

    if (options?.lock) {
      query.lock = options.lock;
    }
    return this.model.findByPk(id, query);
  }
  public async findBy(
    filters: FiltersOrOperators<TModel>,
    options?: GeneralFindOptions<TModel, TRelations> | undefined,
  ): Promise<TModel | null> {
    const { excludeFields, include } = resolveOptions(
      options,
      this.EXCLUDE_FIELDS,
      this.computeRelations,
    );

    const query: FindOptions<TModel> = {
      where: {
        ...filters,
      },
      attributes: {
        exclude: excludeFields as string[],
      },
      include,
      limit: 1,
    };

    if (options?.transaction) {
      query.transaction = options.transaction;
    }

    if (options?.lock) {
      query.lock = options.lock;
    }
    return this.model.findOne(query);
  }
  public async findManyBy(
    filters: FiltersOrOperators<TModel>,
    options?:
      | (GeneralFindOptions<TModel, TRelations> & Partial<PaginationInput>)
      | undefined,
  ): Promise<TModel[]> {
    const { excludeFields, include, order } = resolveOptions(
      options,
      this.EXCLUDE_FIELDS,
      this.computeRelations,
    );

    const query: FindOptions<TModel> = {
      where: {
        ...filters,
      },
      attributes: {
        exclude: excludeFields as string[],
      },
      include,
      limit: calculatePaginationLimit(options?.limit ?? 10),
      offset: calculatePaginationOffset(
        options?.page ?? 1,
        options?.limit ?? 10,
      ),
      order,
    };

    if (options?.transaction) {
      query.transaction = options.transaction;
    }

    if (options?.lock) {
      query.lock = options.lock;
    }

    return this.model.findAll(query);
  }

  public async delete(
    model: TModel,
    options?: OperationOptions,
  ): Promise<void> {
    const deleteOptions: InstanceDestroyOptions = {};

    if (options?.transaction) {
      deleteOptions.transaction = options.transaction;
    }

    await model.destroy();
  }

  public async create(
    data: TCreateInput,
    options?: OperationOptions,
  ): Promise<TModel> {
    const createOptions: CreateOptions<TModel> = {};

    if (options?.transaction) {
      createOptions.transaction = options.transaction;
    }

    return this.model.create(data as any, createOptions);
  }

  public async updateByModel(
    model: TModel,
    data: TUpdateInput,
    options?: OperationOptions,
  ): Promise<TModel> {
    const updateOptions: InstanceUpdateOptions<TModel> = {};

    if (options?.transaction) {
      updateOptions.transaction = options.transaction;
    }

    return model.update(data as any, updateOptions);
  }

  public async reload(
    model: TModel,
    options?: GeneralFindOptions<TModel, TRelations> | undefined,
  ): Promise<TModel> {
    return model.reload(options);
  }
}
