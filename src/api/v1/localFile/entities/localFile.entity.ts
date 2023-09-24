import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { MODEL_NAME } from '../../ts/enums/common';
export const LocalFile = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4() },
    fileName: { type: String },
    path: { type: String },
    mimetype: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, minimize: false, collection: MODEL_NAME.LOCAL_FILE },
);
