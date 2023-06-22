import * as mongoose from 'mongoose';
import { PROVIDER_NAME } from '../ts/enums/common';

export const databaseProviders = [
  {
    provide: PROVIDER_NAME.DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.DB_CONNECT_LINK),
  },
];
