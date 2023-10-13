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

export const dataProvider: DataProvider = {
  create: async <
    RecordType extends Omit<RaRecord, 'id'> = any,
    ResultRecordType extends RaRecord = RecordType & {
      id: Identifier;
    },
  >(
    resource: string,
    params: CreateParams,
  ): Promise<CreateResult<ResultRecordType>> => {
    console.log('dataProvider', 'create', { resource, params });
    return Promise.resolve(undefined);
  },
  delete: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>,
  ): Promise<DeleteResult<RecordType>> => {
    console.log('dataProvider', 'delete', { resource, params });
    return Promise.resolve(undefined);
  },
  deleteMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams<RecordType>,
  ): Promise<DeleteManyResult<RecordType>> => {
    console.log('dataProvider', 'deleteMany', { resource, params });
    return Promise.resolve(undefined);
  },
  getList: async <RecordType extends RaRecord = any>(
    resource: string,
    params: GetListParams,
  ): Promise<GetListResult<RecordType>> => {
    console.log('dataProvider', 'getList', { resource, params });
    return Promise.resolve({ data: [], total: 0 });
  },
  getMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyParams,
  ): Promise<GetManyResult<RecordType>> => {
    console.log('dataProvider', 'getMany', { resource, params });
    return Promise.resolve(undefined);
  },
  getManyReference: async <RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyReferenceParams,
  ): Promise<GetManyReferenceResult<RecordType>> => {
    console.log('dataProvider', 'getManyReference', { resource, params });
    return Promise.resolve(undefined);
  },
  getOne: async <RecordType extends RaRecord = any>(
    resource: string,
    params: GetOneParams<RecordType>,
  ): Promise<GetOneResult<RecordType>> => {
    console.log('dataProvider', 'getOne', { resource, params });
    return Promise.resolve(undefined);
  },
  update: async <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams,
  ): Promise<UpdateResult<RecordType>> => {
    console.log('dataProvider', 'update', { resource, params });
    return Promise.resolve(undefined);
  },
  updateMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateManyParams,
  ): Promise<UpdateManyResult<RecordType>> => {
    console.log('dataProvider', 'updateMany', { resource, params });
    return Promise.resolve(undefined);
  },
};
