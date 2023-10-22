# GraphQL Strapi v4 Provider For React-Admin

GraphQL Strapi v4 Provider for [React Admin](https://marmelab.com/react-admin/).

# Installation

```
npm i ra-strapi-v4-graphql
```

# Usage

```jsx
import * as React from "react";
import { Admin, Resource } from "react-admin";
import { buildProviders } from 'ra-strapi-v4-graphql';

import { PostList } from "./posts";

const { authProvider, dataProvider } = buildProviders({
  url: 'http://localhost:1337/graphql',
});

const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
);
```

# License

This data provider is licensed under the MIT License.
