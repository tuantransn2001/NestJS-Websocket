import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'mongoose';
import { ModelName } from '../../common/enums/common';

const MemberSchema = new Schema({
  id: { type: String },
  type: { type: String },
});

const MessageSchema = new Schema({
  id: { type: String, default: uuidv4 },
  sender: { id: { type: String }, type: { type: String } },
  content: { type: String },
  isDelete: { type: Boolean, default: false },
});

export const ConversationSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    name: { type: String },
    isDelete: { type: Boolean, default: false },
    members: [MemberSchema],
    messages: [MessageSchema],
  },
  { timestamps: true, minimize: false, collection: ModelName.CONVERSATION },
);
