import { Document, FilterQuery, Model, QueryOptions } from 'mongoose';
import { INoSQLBaseRepository } from './ibase.nosql.repository';

export abstract class NoSQLBaseRepositoryAbstract<T>
  implements INoSQLBaseRepository<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  public async create(
    dto: T | any,
  ): Promise<Document<unknown, ObjectType, T> & Required<{ _id: unknown }>> {
    const created_data = await this.model.create(dto);
    return created_data.save();
  }

  public async findOneById(id: string): Promise<T> {
    const item = await this.model.findById(id);
    return item ? item : null;
  }

  public async findOneByCondition(condition = {}): Promise<T> {
    return await this.model
      .findOne({
        ...condition,
        deleted_at: null,
      })
      .exec();
  }

  public async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.count({ ...condition, deleted_at: null }),
      this.model.find(
        { ...condition, deleted_at: null },
        options?.projection,
        options,
      ),
    ]);

    return {
      count,
      items,
    };
  }

  public async update(id: string, dto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate(
      { _id: id, deleted_at: null },
      dto,
      { new: true },
    );
  }

  public async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    const isDeleteSuccess = await this.model
      .findByIdAndUpdate<T>(id, { deleted_at: new Date() })
      .exec();

    return !!isDeleteSuccess;
  }

  public async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    const isDeleteSuccess = await this.model.findByIdAndDelete(id).exec();

    return !!isDeleteSuccess;
  }
}
