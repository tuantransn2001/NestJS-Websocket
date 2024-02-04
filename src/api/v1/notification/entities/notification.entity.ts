import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { USER_TYPE } from '../../user/enum';
import { NotificationType } from '../../chat/constants/notification';
import { ModelName } from '../../common/enums/common';

const UserSchema = new mongoose.Schema({
  id: { type: String },
  type: { type: String, enum: USER_TYPE },
});

export const NotificationSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    type: {
      type: String,
      enum: NotificationType,
      default: NotificationType.INFO,
    },
    read: { type: Boolean, default: false },
    sender: UserSchema,
    receiver: UserSchema,
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, minimize: false, collection: ModelName.NOTIFICATION },
);
