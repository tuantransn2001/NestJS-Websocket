import { z } from 'zod';
import { CreateLocalFileSchema } from '../../shared/localFile.schema';

export type CreateLocalFileDTO = z.infer<typeof CreateLocalFileSchema>;
