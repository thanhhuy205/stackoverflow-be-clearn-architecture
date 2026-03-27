# Express mysql pagination snippets

## Service template

```ts
type NewsFeedResult = {
  posts: Post[];
  pagination: PaginationResponse;
};

export async function getNewsFeed({
  currentPage,
  perPage,
  where
}: {
  currentPage: number;
  perPage: number;
  where: Record<string, unknown>;
}): Promise<ServiceResult<NewsFeedResult>> {
  const [posts, total] = await Promise.all([
    postRepository.findAll({
      page: currentPage,
      limit: perPage,
      where
    }),
    postRepository.count({ where })
  ]);

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
}
```

## Pagination helper

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

## Mysql repository template

```ts
export const postRepository = {
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

    const { sql, params } = buildPostListQuery({
      where: where ?? {},
      orderBy: sortOrder,
      limit: currentLimit,
      offset
    });

    const [rows] = await db.execute(sql, params);
    return rows as Post[];
  },

  async count({ where = {} }: { where?: Record<string, unknown> } = {}) {
    const { sql, params } = buildPostCountQuery({ where });
    const [rows] = await db.execute(sql, params);
    return Number((rows as Array<{ total: number }>)[0]?.total ?? 0);
  }
};
```

## Success tuple shape

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

## Rules checklist

- Use `Promise.all`
- Use repository `findAll`
- Use repository `count`
- Return `ServiceResult<T>`
- Build pagination with `buildPaginationResponse`
- Use `rowCount: items.length`
- Keep filters consistent between list and count
