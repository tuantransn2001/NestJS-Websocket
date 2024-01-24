import { Knex } from 'knex';
import { ModelName } from '../../../common/enums/common';
import { v4 as uuidv4 } from 'uuid';
import { USER_STATUS, USER_TYPE } from '../../../user/enum';
export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable(ModelName.USER, (table) => {
    table.uuid('id').primary().defaultTo(uuidv4());
    table.text('email').notNullable();
    table.text('phone').notNullable();
    table.enum('type', Object.values(USER_TYPE)).defaultTo(USER_TYPE.USER);
    table
      .enum('status', Object.values(USER_STATUS))
      .defaultTo(USER_STATUS.OFFLINE);
    table.text('password');
    table.text('bio');
    table.text('avatar').nullable();
    table.text('first_name');
    table.text('last_name');
    table.text('display_name');
    table.text('birth_day');
    table.text('birth_place');
    table.text('social_ref');
    table.boolean('is_deleted').defaultTo(true);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_reported').defaultTo(false);
    table.boolean('is_blocked').defaultTo(false);
    table.timestamp('last_active_at').defaultTo(knex.fn.now());
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.specificType('search_name', 'tsvector');
    table.index('search_name', null, 'gin');
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(ModelName.USER);
}
