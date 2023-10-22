import type {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from 'ra-core';
import { BuildDataProvider, BuildGraphQLQueryOpts, EntityResponse, EntityResponseCollection, JSONFields, Operation } from './types';
import { buildAndRequestGraphQLQuery } from './buildGraphQLQuery';

export const buildDataProvider: BuildDataProvider = (options) => {
  const { url: graphQLUrl, defaultFields } = options;

  const dataProvider: DataProvider = {
    async create<RecordType extends Omit<RaRecord, 'id'>, ResultRecordType extends RaRecord = RecordType & { id: Identifier }>(
      resource: string,
      params: CreateParams,
    ): Promise<CreateResult<ResultRecordType>> {
      const { data, meta } = params;
      const fields: JSONFields | undefined = meta?.fields || defaultFields?.[resource];
      const variables = { data: { publishedAt: new Date(), ...data } };
      const opts: BuildGraphQLQueryOpts = { graphQLUrl, resource, variables, fields, operation: Operation.Create };
      const response = await buildAndRequestGraphQLQuery<EntityResponse<ResultRecordType>>(opts);
      return { data: { id: response?.data.id, ...response?.data.attributes } };
    },
    async delete<RecordType extends RaRecord>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> {
      const { id, meta } = params;
      const fields: JSONFields | undefined = meta?.fields || defaultFields?.[resource];
      const variables = { id };
      const opts: BuildGraphQLQueryOpts = { graphQLUrl, resource, variables, fields, operation: Operation.Delete };
      const response = await buildAndRequestGraphQLQuery<EntityResponse<RecordType>>(opts);
      return { data: { id: response?.data.id, ...response?.data.attributes } };
    },
    async deleteMany<RecordType extends RaRecord>(resource: string, params: DeleteManyParams<RecordType>): Promise<DeleteManyResult<RecordType>> {
      const { ids, meta } = params;
      const deleted = await Promise.all(
        (ids || []).map(async (id): Promise<string> => {
          const result = await this.delete(resource, { id, meta });
          return result.data.id;
        }),
      );
      return { data: deleted };
    },
    async getList<RecordType extends RaRecord>(resource: string, params: GetListParams): Promise<GetListResult<RecordType>> {
      const {
        pagination: { page, perPage },
        sort: { field, order },
        meta,
      } = params;
      const fields: JSONFields | undefined = meta?.fields || defaultFields?.[resource];
      const variables = { sort: [`${field}:${order}`], pagination: { page, pageSize: perPage } };
      const opts: BuildGraphQLQueryOpts = { graphQLUrl, resource, isCollection: true, variables, fields };
      const result = await buildAndRequestGraphQLQuery<EntityResponseCollection<RecordType>>(opts);
      return {
        data: (result?.data || []).map(({ id, attributes }) => ({ id, ...attributes })),
        total: result?.meta?.pagination?.total || 0,
      };
    },
    async getMany<RecordType extends RaRecord>(resource: string, params: GetManyParams): Promise<GetManyResult<RecordType>> {
      const { ids, meta } = params;
      const fields: JSONFields | undefined = meta?.fields || defaultFields?.[resource];
      const variables = { filters: { id: { in: ids } } };
      const opts: BuildGraphQLQueryOpts = { graphQLUrl, resource, isCollection: true, variables, fields };
      const result = await buildAndRequestGraphQLQuery<EntityResponseCollection<RecordType>>(opts);
      return { data: (result?.data || []).map(({ id, attributes }) => ({ id, ...attributes })) };
    },
    async getManyReference<RecordType extends RaRecord>(
      resource: string,
      params: GetManyReferenceParams,
    ): Promise<GetManyReferenceResult<RecordType>> {
      // TODO: Implement this function
      console.log('dataProvider', 'getManyReference', { resource, params });
      return Promise.resolve(undefined);
    },
    async getOne<RecordType extends RaRecord>(resource: string, params: GetOneParams<RecordType>): Promise<GetOneResult<RecordType>> {
      const { id, meta } = params;
      const fields: JSONFields | undefined = meta?.fields || defaultFields?.[resource];
      const variables = { id };
      const opts: BuildGraphQLQueryOpts = { graphQLUrl, resource, variables, fields };
      const { data } = await buildAndRequestGraphQLQuery<EntityResponse<RecordType>>(opts);
      return { data: { id: data.id, ...data.attributes } };
    },
    async update<RecordType extends RaRecord>(resource: string, params: UpdateParams): Promise<UpdateResult<RecordType>> {
      const {
        data: { id, ...data },
        meta,
      } = params;
      const fields: JSONFields | undefined = meta?.fields || defaultFields?.[resource];
      const variables = { id, data };
      const opts: BuildGraphQLQueryOpts = { graphQLUrl, resource, variables, fields, operation: Operation.Update };
      const response = await buildAndRequestGraphQLQuery<EntityResponse<RecordType>>(opts);
      return { data: { id: response?.data.id, ...response.data.attributes } };
    },
    async updateMany<RecordType extends RaRecord>(resource: string, params: UpdateManyParams): Promise<UpdateManyResult<RecordType>> {
      const { ids, data, meta } = params;
      const updated = await Promise.all(
        (ids || []).map(async (id): Promise<string> => {
          const result = await this.update(resource, { id, data, previousData: {}, meta });
          return result.data.id;
        }),
      );
      return { data: updated };
    },
  };

  return dataProvider;
};
