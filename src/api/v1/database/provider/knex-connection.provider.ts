import { knex } from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { ProviderName } from '../../common/enums/common';

export const databaseProviders = [
  {
    provide: ProviderName.KNEX_CONNECTION,

    useFactory: () => {
      // creates a Knex connection
      // https://knexjs.org
      const knexConn = knex({
        client: 'pg',
        connection:
          'postgresql://postgres:tuantransn2001@localhost:5432/messenger',
        migrations: {
          directory: './src/api/v1/database/knex/migrations',
          extension: 'ts',
          loadExtensions: [`.ts`],
          // copy-paste migrations
          // stub: './src/database/stubs/migration.stub',
        },
        //   seeds: {
        //     directory: './src/database/seeds',
        //     extension: extension,
        //     loadExtensions: [`.${extension}`],
        //   },
      });

      // now every model has this knex instance
      // we dont need to DI or anything to setup the model with objection
      Model.knex(knexConn);

      // now we can inject this connection to other modules
      // check database.health.ts
      return knexConn;
    },
  },
];
// export const databaseProviders = [
//   {
//     provide: ProviderName.KNEX_CONNECTION,
//     useFactory: () => {
//       const isDevEnv = process.env.NODE_ENV === 'develop';
//       const database_connection_string = process.env.POSTGRESQL_DB_CONNECT_LINK;

//       const knexConn = knex({
//         client: 'pg',
//         connection: {
//           connectionString: database_connection_string,
//         },
//         pool: { min: 0, max: 100 },
//         debug: isDevEnv,

//         ...knexSnakeCaseMappers(),
//       });

//       Model.knex(knexConn);

//       return knexConn;
//     },
//   },
// ];
