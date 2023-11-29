import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserType } from '../../user/enum';
import { NotificationType } from '../../chat/constants/notification_constants';
import { ModelName } from '../../common/enums/common';

export const Notification = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4() },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    type: {
      type: String,
      enum: NotificationType,
      default: NotificationType.INFO,
    },
    read: {
      type: Boolean,
      default: false,
    },
    user: {
      id: { type: String },
      type: { type: String, enum: UserType },
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, minimize: false, collection: ModelName.NOTIFICATION },
);
