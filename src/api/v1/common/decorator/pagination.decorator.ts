import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

const PAGING = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  MIN_PAGE: 1,
  MAX_PAGE: 100000,
};

export interface Pagination {
  offset?: number;
  limit?: number;
  sort?: { field: string; by: 'ASC' | 'DESC' }[];
  search?: { [key: string]: string | boolean };
}

const parseSort = (sort: string): Pagination['sort'] => {
  const sortArray = sort.split(',');
  return sortArray.map((sortItem) => {
    const sortBy = sortItem[0];
    switch (sortBy) {
      case '-':
        return {
          field: sortItem.slice(1),
          by: 'ASC',
        };
      case '+':
        return {
          field: sortItem.slice(1),
          by: 'ASC',
        };
      default:
        return {
          field: sortItem.trim(),
          by: 'DESC',
        };
    }
  });
};

const parseSearch = (search: string): Pagination['search'] => {
  const searchParams = search.split(',');
  const searchObject: Record<string, any> = {};

  for (const param of searchParams) {
    const [key, value] = param.split(':');
    if (key.startsWith('is_')) {
      searchObject[key] = value === '1' || value.toLowerCase() === 'true';
    } else {
      searchObject[key] = value;
    }
  }

  return searchObject;
};

export const GetPagination = createParamDecorator(
  (_, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    const paginationParams: Pagination = {
      offset: PAGING.DEFAULT_PAGE,
      limit: PAGING.DEFAULT_LIMIT,
      sort: [],
      search: {},
    };

    if (req.query.sort) {
      paginationParams.sort = parseSort(req.query.sort.toString());
    }

    if (req.query.search) {
      paginationParams.search = parseSearch(req.query.search.toString());
    }

    if (!req.query.limit || !req.query.offset) return paginationParams;

    const isInValidInput =
      parseInt(req.query.limit.toString()) < PAGING.MIN_LIMIT ||
      parseInt(req.query.limit.toString()) > PAGING.MAX_LIMIT ||
      parseInt(req.query.offset.toString()) < PAGING.MIN_PAGE ||
      parseInt(req.query.offset.toString()) > PAGING.MAX_PAGE;

    if (isInValidInput)
      throw new BadRequestException({
        message: [
          `limit must be between ${PAGING.MIN_LIMIT} and ${PAGING.MAX_LIMIT}`,
          `offset must be between ${PAGING.MIN_PAGE} and ${PAGING.MAX_PAGE}`,
        ],
      });

    paginationParams.offset = req.query.offset
      ? parseInt(req.query.offset.toString()) -
        1 * parseInt(req.query.limit.toString())
      : PAGING.DEFAULT_PAGE;
    paginationParams.limit = req.query.limit
      ? parseInt(req.query.limit.toString())
      : PAGING.DEFAULT_LIMIT;

    return paginationParams;
  },
);
