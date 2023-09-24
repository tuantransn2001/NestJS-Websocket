import mongoose from 'mongoose';
import { MODEL_NAME } from '../../ts/enums/common';
import { v4 as uuidv4 } from 'uuid';
export const HealthCheck = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4() },
    event: String,
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    collection: MODEL_NAME.HEALTH_CHECK,
    minimize: false,
  },
);
