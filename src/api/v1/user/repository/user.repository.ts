import { Knex } from 'knex';
import { IUser } from '../shared/user.interface';
import { SQLBaseRepository } from '../../common/repository/sql/base.sql.repository';
import { ModelName } from '../../common/enums/common';
import { IUserRepository } from './iuser.repository';
import { Injectable } from '@nestjs/common';
import { isEmpty } from '../../common';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class UserRepository
  extends SQLBaseRepository<IUser>
  implements IUserRepository
{
  constructor(
    @InjectKnex()
    protected readonly db: Knex,
  ) {
    super(db, ModelName.USER);
  }

  private async findByField(
    field: string,
    value: string,
  ): Promise<IUser | null> {
    if (!value) return null;

    const foundUser = await this.db(this.tableName)
      .where(field, value)
      .andWhere('is_deleted', false)
      .first()
      .returning('*');

    if (isEmpty(foundUser)) return null;

    return foundUser[0];
  }

  public async findUniq(id: string): Promise<IUser | null> {
    return this.findByField('id', id);
  }

  public async findByPhone(phone: string): Promise<IUser | null> {
    return this.findByField('phone', phone);
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return this.findByField('email', email);
  }

  public async findByPhoneOrEmail(
    phone?: string,
    email?: string,
  ): Promise<IUser[]> {
    const result: IUser[] = [];

    if (phone) {
      const foundUserByPhone = await this.findByPhone(phone);
      if (!isEmpty(foundUserByPhone)) result.push(foundUserByPhone);
    }

    if (email) {
      const foundUserByEmail = await this.findByEmail(email);
      if (!isEmpty(foundUserByEmail)) result.push(foundUserByEmail);
    }

    return result;
  }

  public async searchUserByName(payload: {
    limit: number;
    offset: number;
    idsToSkip: number;
    name?: string;
  }) {
    if (isEmpty(payload.name))
      return {
        count: 0,
        items: [],
      };

    const foundUsers = await this.db(this.tableName)
      .where('first_name', 'like', `%${payload.name}%`)
      .andWhere('is_deleted', false)
      .offset(payload.offset)
      .limit(payload.limit);

    return {
      count: foundUsers?.length,
      items: foundUsers.map((user) => user.toDto()),
    };
  }
}
