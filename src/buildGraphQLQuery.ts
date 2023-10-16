import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query';
import { request, Variables } from 'graphql-request';
import camelCase from 'lodash/camelCase';
import { plural, singular } from 'pluralize';
import { BuildGraphQLQueryOpts, Operation } from './types';

const queryVariables: Record<Operation | 'single' | 'collection', (resource: string) => Variables> = {
  [Operation.Create]: (resource: string): Variables => ({
    data: `${resource}Input!`,
    locale: 'I18NLocaleCode',
  }),
  [Operation.Update]: (resource: string): Variables => ({
    id: 'ID!',
    data: `${resource}Input!`,
    locale: 'I18NLocaleCode',
  }),
  [Operation.Delete]: () => ({ id: 'ID!', locale: 'I18NLocaleCode' }),
  single: () => ({ id: 'ID!', locale: 'I18NLocaleCode' }),
  collection: (resource: string): Variables => ({
    filters: `${resource}FiltersInput`,
    pagination: 'PaginationArg',
    sort: '[String]',
    publicationState: 'PublicationState',
    locale: 'I18NLocaleCode',
  }),
};

const getVariables = (resource: string, isCollection: boolean, operation?: Operation) => {
  let variables: Variables;
  if (operation) {
    variables = queryVariables[operation](resource);
  } else {
    variables = (isCollection ? queryVariables['collection'] : queryVariables['single'])(resource);
  }
  const keys = Object.keys(variables);
  const args = keys.reduce(
    (previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: new VariableType(currentValue),
      };
    },
    {} as Record<string, VariableType>,
  );
  return [variables, args] as const;
};

const getJwtHeader = () => {
  try {
    const jwt = localStorage.getItem('jwt');
    return { Authorization: `Bearer ${jwt}` };
  } catch (e) {
    // Do nothing
    return {};
  }
};

export const buildAndRequestGraphQLQuery = async <TResult>(opts: BuildGraphQLQueryOpts) => {
  const { graphQLUrl, resource, isCollection = false, variables, fields, operation } = opts;
  let queryName: string;
  if (operation) queryName = `${operation}${resource}`;
  else queryName = camelCase(isCollection ? plural(resource) : singular(resource));

  const [__variables, __args] = getVariables(resource, isCollection, operation);

  const response = await request<{
    [key: string]: TResult;
  }>({
    url: graphQLUrl,
    document: jsonToGraphQLQuery(
      {
        [operation ? 'mutation' : 'query']: {
          __variables,
          [queryName]: {
            __args,
            data: { id: true, attributes: fields },
            ...(isCollection ? { meta: { pagination: { total: true } } } : {}),
          },
        },
      },
      { pretty: false },
    ),
    variables,
    requestHeaders: getJwtHeader(),
  });
  return response?.[queryName];
};
