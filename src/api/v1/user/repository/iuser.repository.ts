import { ISQLBaseRepository } from '../../common/repository/sql/ibase.sql.repository';
import { IUser } from '../shared/user.interface';

export interface IUserRepository extends ISQLBaseRepository<IUser> {
  findUniq(id?: string): Promise<IUser | null>;
  findByPhone(phone?: string): Promise<IUser | null>;
  findByEmail(email?: string): Promise<IUser | null>;
  findByPhoneOrEmail(phone?: string, email?: string): Promise<IUser[] | any[]>;
  // todo: fix
  searchUserByName(payload: {
    limit: number;
    offset: number;
    idsToSkip: number;
    name?: string;
  }): any;
}
