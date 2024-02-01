import { Injectable } from '@nestjs/common';
import { ILocalFile } from '../shared/localFile.interface';
import { NoSQLBaseRepositoryAbstract } from '../../common/repository/nosql/base.nosql.repository';

@Injectable()
export abstract class LocalFileRepository extends NoSQLBaseRepositoryAbstract<ILocalFile> {}
