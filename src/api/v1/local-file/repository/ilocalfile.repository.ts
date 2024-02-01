import { INoSQLBaseRepository } from '../../common/repository/nosql/ibase.nosql.repository';
import { ILocalFile } from '../shared/localFile.interface';

export type ILocalFileRepository = INoSQLBaseRepository<ILocalFile>;
