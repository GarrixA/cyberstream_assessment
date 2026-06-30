import { PaginationQuery } from "../types/model";

export const parsePagination = (query: PaginationQuery) => {
	const page = Math.max(1, parseInt(query.page || "1", 10));
	const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
	const offset = (page - 1) * limit;
	const sortOrder =
		query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
	return { page, limit, offset, sortOrder };
};

export const buildPaginationMeta = (
	total: number,
	page: number,
	limit: number,
) => ({
	total,
	page,
	limit,
	totalPages: Math.ceil(total / limit) || 1,
});
