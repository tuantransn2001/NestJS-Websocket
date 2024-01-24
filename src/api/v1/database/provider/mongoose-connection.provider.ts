import * as mongoose from 'mongoose';
import { ProviderName } from '../../common/enums/common';

export const databaseProviders = [
  {
    provide: ProviderName.MONGOOSE_CONNECTION,
    useFactory: () => {
      return mongoose.connect(`${process.env.MONGOOSE_DB_CONNECT_LINK}`);
    },
  },
];
