export const BaseEntity = {
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
  isDelete: { type: Boolean, default: false },
};
