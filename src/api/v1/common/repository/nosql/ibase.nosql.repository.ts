import { Document } from 'mongoose';

export interface INoSQLBaseRepository<T> {
  create(
    dto: T | any,
  ): Promise<Document<unknown, ObjectType, T> & Required<{ _id: unknown }>>;
  findOneById(id: string, projection?: string): Promise<T>;
  findOneByCondition(condition?: object, projection?: string): Promise<T>;
  findAll(condition: object, options?: object): Promise<FindAllResponse<T>>;
  update(id: string, dto: Partial<T>): Promise<T>;
  softDelete(id: string): Promise<boolean>;
  permanentlyDelete(id: string): Promise<boolean>;
}
