import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { ModelName } from '../../common/enums/common';
export const LocalFile = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4() },
    fileName: { type: String },
    path: { type: String },
    mimeType: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, minimize: false, collection: ModelName.LOCAL_FILE },
);
