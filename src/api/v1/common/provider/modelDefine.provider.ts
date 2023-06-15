import { Connection, Schema } from 'mongoose';
import { PROVIDER_NAME } from '../../ts/enums/common';

export const modelDefineProvider = <N extends string, S extends Schema<any>>(
  ModelName: N,
  Schema: S,
) => [
  {
    provide: ModelName,
    useFactory: (connection: Connection) => connection.model(ModelName, Schema),
    inject: [PROVIDER_NAME.DATABASE_CONNECTION],
  },
];
