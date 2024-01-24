import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentTime } from '..';
export default class BaseModel extends Model {
  id!: string;
  is_deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  $beforeInsert() {
    if (!this.id) this.id = uuidv4();
    this.createdAt = getCurrentTime();
    this.updatedAt = getCurrentTime();
  }

  $beforeUpdate() {
    this.updatedAt = getCurrentTime();
  }
}
