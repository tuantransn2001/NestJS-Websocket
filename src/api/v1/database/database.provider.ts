import * as mongoose from 'mongoose';
import { PROVIDER_NAME } from '../common/enums/common';

export const databaseProviders = [
  {
    provide: PROVIDER_NAME.DATABASE_CONNECTION,
    useFactory: () => {
      return mongoose.connect(`${process.env.DB_CONNECT_LINK}`);
    },
  },
];
