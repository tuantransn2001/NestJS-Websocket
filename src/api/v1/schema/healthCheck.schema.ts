import mongoose from 'mongoose';

export const HealthCheckSchema = new mongoose.Schema(
  {
    event: String,
  },
  {
    collection: 'HealthCheck',
    minimize: false,
  },
);
