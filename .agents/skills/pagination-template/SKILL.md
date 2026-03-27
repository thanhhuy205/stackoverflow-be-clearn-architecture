---
name: pagination-template
description: "enforce a standard pagination pattern for express and mysql codebases. use when generating or refactoring list endpoints, services, repositories, or response types that must follow this exact convention: fetch rows and total with promise.all, use repository findall and count methods, return typed serviceresult values, and always build pagination metadata with buildpaginationresponse."
---

# Pagination template

Apply this skill when the user wants pagination code for an Express + MySQL backend, or wants existing list/query code refactored to the team pagination standard.

## Required standard

For every paginated flow, enforce all of these rules:

1. Fetch rows and total in parallel with `Promise.all`.
2. The repository must expose `findAll` and `count`.
3. The repository `findAll` must accept `page`, `limit`, `where`, and optional `orderBy`.
4. The repository `count` must accept `where`.
5. The service return type must be `ServiceResult<ResponseType>`.
6. The success payload must always include a `pagination` field built with `buildPaginationResponse(...)`.
7. The service must return the tuple shape `[null, data]` for success unless the user explicitly gives a different house style.

Do not replace this pattern with ad hoc pagination metadata or manual object shapes.

## Canonical service pattern

Always use this pattern when both rows and total are needed:

```ts
const [posts, total] = await Promise.all([
  postRepository.findAll({
    page: currentPage,
    limit: perPage,
    where
  }),
  postRepository.count({ where })
]);
```

Do not execute `findAll` and `count` sequentially.

## Canonical pagination builder

Always use this helper for pagination metadata:

```ts
export const buildPaginationResponse = ({
  currentPage,
  perPage,
  total,
  rowCount
}: {
  currentPage: number;
  perPage: number;
  total: number;
  rowCount: number;
}): PaginationResponse => {
  const lastPage = total > 0 ? Math.ceil(total / perPage) : 0;
  const from = rowCount > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const to = rowCount > 0 ? from + rowCount - 1 : 0;

  return {
    currentPage,
    perPage,
    total,
    lastPage,
    from,
    to
  };
};
```

Never handwrite `lastPage`, `from`, `to`, or a custom pagination object when this helper is available or requested by the user.

## Canonical success return shape

When generating or refactoring service code, use this success structure:

```ts
return [
  null,
  {
    posts,
    pagination: buildPaginationResponse({
      currentPage,
      perPage,
      total,
      rowCount: posts.length
    })
  }
];
```

If the entity name is not `posts`, rename only the collection field to match the module, but keep the pagination logic unchanged.

Examples:

```ts
return [null, { users, pagination: buildPaginationResponse(...) }];
return [null, { orders, pagination: buildPaginationResponse(...) }];
return [null, { comments, pagination: buildPaginationResponse(...) }];
```

## Service result typing

Use `ServiceResult<T>` where `T` is the response payload type.

Example:

```ts
type NewsFeedResult = {
  posts: Post[];
  pagination: PaginationResponse;
};

async function getNewsFeed(...): Promise<ServiceResult<NewsFeedResult>> {
  // implementation
}
```

When the user gives an existing response type, preserve that type name. If no response type exists, generate one that contains the list field and `pagination`.

## Repository standard

Repository methods must follow this structure:

```ts
findAll({
  page,
  limit,
  where,
  orderBy
}: {
  page: number;
  limit: number;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
}) {
  const { currentLimit, offset } = buildPagination(page, limit);
  const sortOrder = orderBy ?? { createdAt: 'desc' };

  return prisma.post.findMany({
    where: where ?? {},
    orderBy: sortOrder,
    skip: offset,
    take: currentLimit
  });
}

count({ where = {} }: { where?: Prisma.PostWhereInput } = {}) {
  return prisma.post.count({ where });
}
```

For Express + MySQL codebases that do not use Prisma, preserve the same interface and intent:

- `findAll` receives `page`, `limit`, `where`, and optional `orderBy`
- `count` receives `where`
- pagination math comes from a shared helper such as `buildPagination(page, limit)`
- default sort should be descending by creation timestamp unless the user specifies otherwise
- `findAll` applies limit and offset in SQL or query builder form

Translate ORM specifics to the user's stack without changing the contract.

## Express + MySQL adaptation rules

When the codebase uses raw SQL, knex, mysql2, sequelize, objection, or another MySQL access layer:

1. Keep the outer pagination convention identical.
2. Convert repository internals to the local query style.
3. Preserve `findAll` and `count` signatures even if the SQL differs.
4. Use `LIMIT ? OFFSET ?` or the equivalent query-builder form.
5. Keep filters in `where` aligned between `findAll` and `count`.

Example shape for mysql-style repositories:

```ts
async findAll({
  page,
  limit,
  where,
  orderBy
}: {
  page: number;
  limit: number;
  where?: Record<string, unknown>;
  orderBy?: string;
}) {
  const { currentLimit, offset } = buildPagination(page, limit);
  const sortOrder = orderBy ?? 'created_at DESC';

  return db.query(
    `SELECT * FROM posts
     WHERE /* build from where */
     ORDER BY ${sortOrder}
     LIMIT ? OFFSET ?`,
    [currentLimit, offset]
  );
}

async count({ where = {} }: { where?: Record<string, unknown> } = {}) {
  return db.query(
    `SELECT COUNT(*) AS total FROM posts WHERE /* build from where */`,
    []
  );
}
```

Use parameterized queries for values. Do not interpolate filter values directly into SQL.

## Workflow for generating code

When asked to create a paginated endpoint or service:

1. Identify the entity name and response type.
2. Create or update the response type to include the array field and `pagination`.
3. Make the service return `Promise<ServiceResult<ResponseType>>`.
4. Build shared filters in `where`.
5. Fetch rows and total with `Promise.all`.
6. Return `[null, { entityList, pagination: buildPaginationResponse(...) }]`.
7. Add or update repository `findAll` and `count` methods.

## Workflow for refactoring existing code

When the user provides existing code:

1. Keep business logic and filters intact.
2. Replace sequential `await` calls for list and total with `Promise.all`.
3. Replace any manual pagination object with `buildPaginationResponse(...)`.
4. Rename repository methods to `findAll` and `count` if the user wants strict conformity.
5. Preserve the user's Express + MySQL stack and coding style where possible.
6. Return concrete code, not pseudocode.

## Output rules

When responding with code:

- produce TypeScript or JavaScript that fits Express services and repositories
- prefer minimal diffs when the user supplied existing code
- keep the exact pagination conventions from this skill
- if required helpers or types are missing, add them
- if stack details are ambiguous, default to Express + TypeScript + mysql repository style

## Reference snippets

See `references/express-mysql-pagination.md` for copyable templates.
