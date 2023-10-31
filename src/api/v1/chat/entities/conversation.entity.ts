import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { MODEL_NAME } from '../../common/enums/common';
export const Conversation = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4() },
    name: { type: String },
    isDelete: { type: Boolean, default: false },
    members: {
      type: [
        {
          id: { type: String },
          type: { type: String },
        },
      ],
    },
    messages: {
      type: [
        {
          id: { type: String, default: uuidv4() },
          sender: { id: { type: String }, type: { type: String } },
          content: { type: String },
          isDelete: { type: Boolean, default: false },
          createdAt: { type: Date, default: new Date() },
          updatedAt: { type: Date },
        },
      ],
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, minimize: false, collection: MODEL_NAME.CONVERSATION },
);
