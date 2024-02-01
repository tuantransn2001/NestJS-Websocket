import { Knex } from 'knex';
import { ISQLBaseRepository } from './ibase.sql.repository';
import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export abstract class SQLBaseRepository<T> implements ISQLBaseRepository<T> {
  constructor(
    @InjectKnex() protected readonly db: Knex,
    protected readonly tableName: string,
  ) {}

  public async createOne(data: Partial<T>): Promise<T[]> {
    return this.db(this.tableName).insert(data).returning('*');
  }

  public async pureOne(id: string): Promise<T> {
    return this.db(this.tableName).where({ id }).first();
  }

  public async updateOne(id: string, data: Partial<T>): Promise<T[]> {
    return this.db(this.tableName)
      .where({ id })
      .update({ ...data, updatedAt: new Date() })
      .returning('*');
  }

  public async deleteOne(id: string): Promise<void> {
    await this.db(this.tableName).where({ id }).del();
  }
}
