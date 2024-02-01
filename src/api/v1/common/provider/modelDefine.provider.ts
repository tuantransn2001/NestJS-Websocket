import { Connection, Schema } from 'mongoose';
import { ProviderName } from '../enums/common';

export const modelDefineProvider = (
  ModelName: string,
  Schema: Schema<unknown>,
) => [
  {
    provide: ModelName,
    useFactory: (connection: Connection) => connection.model(ModelName, Schema),
    inject: [ProviderName.MONGOOSE_CONNECTION],
  },
];
