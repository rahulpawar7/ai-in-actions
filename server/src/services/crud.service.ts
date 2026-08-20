import type { FilterQuery, Model, SortOrder, UpdateQuery } from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { buildPaginationMeta, type PaginationMeta } from '../utils/apiResponse';
import { invalidatePublicCache } from '../utils/cache';
import { sanitizeAdminPayload } from '../utils/sanitizeAdminPayload';

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  isActive?: boolean;
  includeDeleted?: boolean;
  filters?: Record<string, unknown>;
}

export interface CrudServiceOptions<T> {
  model: Model<T>;
  resource: string;
  searchableFields?: string[];
  defaultSort?: Record<string, SortOrder>;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createCrudService<T>(options: CrudServiceOptions<T>) {
  const { model, resource } = options;
  const supportsSoftDelete = Boolean(model.schema.path('isDeleted'));
  const supportsOrder = Boolean(model.schema.path('order'));
  const supportsActive = Boolean(model.schema.path('isActive'));
  const defaultSort: Record<string, SortOrder> =
    options.defaultSort ?? (supportsOrder ? { order: 1, createdAt: -1 } : { createdAt: -1 });

  const baseFilter = (includeDeleted = false): FilterQuery<T> =>
    (supportsSoftDelete && !includeDeleted ? { isDeleted: false } : {}) as FilterQuery<T>;

  async function findDocument(id: string, includeDeleted = false) {
    const document = await model.findOne({ _id: id, ...baseFilter(includeDeleted) } as FilterQuery<T>);
    if (!document) throw ApiError.notFound(`${resource} not found`);
    return document;
  }

  return {
    resource,
    async list(query: ListQuery): Promise<{ items: T[]; meta: PaginationMeta }> {
      const limit = Math.min(Math.max(query.limit ?? 50, 1), 100);
      const page = Math.max(query.page ?? 1, 1);
      const filter: FilterQuery<T> = { ...baseFilter(query.includeDeleted), ...(query.filters ?? {}) } as FilterQuery<T>;
      if (supportsActive && typeof query.isActive === 'boolean') {
        (filter as Record<string, unknown>).isActive = query.isActive;
      }
      if (query.search && options.searchableFields?.length) {
        const expression = new RegExp(escapeRegExp(query.search), 'i');
        (filter as Record<string, unknown>).$or = options.searchableFields.map((field) => ({ [field]: expression }));
      }
      const [items, total] = await Promise.all([
        model
          .find(filter)
          .sort(defaultSort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        model.countDocuments(filter),
      ]);
      return { items: items as T[], meta: buildPaginationMeta(page, limit, total) };
    },
    async findById(id: string) {
      return (await findDocument(id)).toJSON();
    },
    async create(payload: Partial<T>) {
      const sanitized = sanitizeAdminPayload(payload as Record<string, unknown>);
      const created = await model.create(sanitized);
      invalidatePublicCache();
      return created.toJSON();
    },
    async update(id: string, payload: UpdateQuery<T>) {
      const document = await findDocument(id);
      const sanitized = sanitizeAdminPayload(payload as Record<string, unknown>);
      const preserved: Record<string, unknown> = {
        _id: document._id,
        createdAt: document.get('createdAt'),
      };
      if (supportsSoftDelete) {
        preserved.isDeleted = document.get('isDeleted') ?? false;
        preserved.deletedAt = document.get('deletedAt') ?? null;
      }
      document.overwrite({ ...sanitized, ...preserved } as UpdateQuery<T>);
      await document.save();
      invalidatePublicCache();
      return document.toJSON();
    },
    async softDelete(id: string) {
      const document = await findDocument(id);
      if (supportsSoftDelete) {
        document.set({ isDeleted: true, deletedAt: new Date(), isActive: false } as UpdateQuery<T>);
        await document.save();
      } else {
        await document.deleteOne();
      }
      invalidatePublicCache();
      return document.toJSON();
    },
    async reorder(entries: { id: string; order: number }[]) {
      await Promise.all(entries.map((entry) => model.updateOne({ _id: entry.id }, { order: entry.order })));
      invalidatePublicCache();
      return entries.length;
    },
    async toggleActive(id: string, isActive: boolean) {
      const document = await findDocument(id);
      document.set({ isActive } as UpdateQuery<T>);
      await document.save();
      invalidatePublicCache();
      return document.toJSON();
    },
  };
}

export function createSingletonService<T>(model: Model<T>, resource: string) {
  return {
    async get() {
      const document = await model.findOne({ key: 'default' } as FilterQuery<T>);
      if (!document) throw ApiError.notFound(`${resource} not found`);
      return document.toJSON();
    },
    async update(payload: UpdateQuery<T>) {
      const sanitized = sanitizeAdminPayload(payload as Record<string, unknown>);
      let document = await model.findOne({ key: 'default' } as FilterQuery<T>);
      if (!document) {
        document = await model.create({ key: 'default', ...sanitized } as UpdateQuery<T>);
      } else {
        document.overwrite({
          key: 'default',
          ...sanitized,
          createdAt: document.get('createdAt'),
        } as UpdateQuery<T>);
        await document.save();
      }
      invalidatePublicCache();
      return document.toJSON();
    },
  };
}
