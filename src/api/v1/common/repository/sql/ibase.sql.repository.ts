export interface ISQLBaseRepository<T> {
  createOne(data: Partial<T>): Promise<T[]>;
  pureOne(id: string): Promise<T>;
  updateOne(id: string, data: Partial<T>): Promise<T[]>;
  deleteOne(id: string): Promise<void>;
}
