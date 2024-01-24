import { ModelName } from '../../../common/enums/common';
import BaseModel from '../../../common/models/base.model';
import { USER_TYPE, USER_STATUS } from 'src/api/v1/user/enum';
import { getCurrentTime } from 'src/api/v1/common';
export class User extends BaseModel {
  static get tableName() {
    return ModelName.USER;
  }

  email!: string;
  phone!: string;
  password!: string;
  first_name!: string;
  last_name!: string;
  middle_name!: string;
  display_name!: string;
  birth_place!: string;
  birth_day!: string;
  bio!: string;
  social_ref!: string;
  avatar!: string | null;
  status!: USER_STATUS;
  type!: USER_TYPE;
  is_active!: boolean;
  is_reported!: boolean;
  is_blocked!: boolean;
  last_active_at!: Date;

  $beforeInsert(): void {
    this.createdAt = getCurrentTime();
    this.updatedAt = getCurrentTime();
    this.last_active_at = getCurrentTime();
  }

  $beforeUpdate(): void {
    this.updatedAt = getCurrentTime();
  }

  static get jsonSchema() {
    return {
      type: 'object',

      required: ['phone', 'first_name', 'password'],

      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        bio: { type: 'string' },
        password: { type: 'string' },
        social_ref: { type: 'string' },
        display_name: { type: 'string' },
        birth_day: { type: 'string' },
        birth_place: { type: 'string' },
        status: { type: typeof USER_STATUS },
        type: { type: typeof USER_TYPE },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        middle_name: { type: 'string' },
        avatar: { type: ['string', 'null'] },
        is_active: { type: 'boolean' },
        is_reported: { type: 'boolean' },
        is_blocked: { type: 'boolean' },
        last_active_at: { type: 'date' },
      },
    };
  }

  static get relationMappings() {
    return {};
  }

  public toDto() {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      status: this.status,
      first_name: this.first_name,
      last_name: this.last_name,
      middle_name: this.middle_name,
      fullName: `${this.last_name} ${this.middle_name} ${this.first_name}`,
      type: this.type,
      is_active: this.is_active,
      last_active_at: this.last_active_at,
      createdAt: this.createdAt,
      avatar: this.avatar,
    };
  }
}
