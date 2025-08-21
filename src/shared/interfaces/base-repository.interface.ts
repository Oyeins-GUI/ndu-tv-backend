import {
  FiltersOrOperators,
  GeneralFindOptions,
  PaginationInput,
} from '../types/repositories.types';

export interface IBaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TRelations extends string | undefined = '',
  TFindOptions = GeneralFindOptions<TModel, TRelations>,
> {
  /**
   * Finds a single  entity by ID
   * @param id - ID of the entity
   * @param options - Options to find entity by
   */
  findById(id: string, options?: TFindOptions): Promise<TModel | null>;

  /**
   * Finds a single entity by the specified filters
   * @param filters - Filters or operators to find entity by
   * @param options - Entity Find Options
   */
  findBy(
    filters: FiltersOrOperators<TModel>,
    options?: TFindOptions,
  ): Promise<TModel | null>;

  /**
   * Finds many entities by the specified filters
   * @param filters - Filters or operators to find entities by
   * @param options - Entity Find Options with pagination
   */
  findManyBy(
    filters: FiltersOrOperators<TModel>,
    options?: TFindOptions & Partial<PaginationInput>,
  ): Promise<TModel[]>;

  /**
   * Delete an entity by the model
   * @param model - The entity instance to delete
   */
  delete(model: TModel): Promise<void>;

  /**
   * Creates an entity
   * @param data - Input data to create entity
   */
  create(data: TCreateInput): Promise<TModel>;

  /**
   * Updates entity data by a model instance
   * @param model - The model instance to update
   * @param data - The update data
   */
  updateByModel(model: TModel, data: TUpdateInput): Promise<TModel>;
}
