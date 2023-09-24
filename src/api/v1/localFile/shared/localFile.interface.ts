import { z } from 'zod';
import { LocalFileSchema } from './localFile.schema';

export type ILocalFile = z.infer<typeof LocalFileSchema>;
