export type PaginationParams = {
    page: number;
    limit: number;
};

export type PaginationMeta = PaginationParams & {
    total: number;
    totalPages: number;
};
